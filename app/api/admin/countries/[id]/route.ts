import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"

interface RouteParams {
  params: {
    id: string
  }
}

// GET single country
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const country = await prisma.country.findUnique({
      where: { id: params.id },
      include: {
        cities: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { events: true }
            }
          }
        }
      }
    })

    if (!country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      )
    }

    // Get event count from both systems
    const newSystemCount = await prisma.eventsOnCountries.count({
      where: { countryId: params.id }
    })

    const oldSystemCount = await prisma.event.count({
      where: {
        OR: [
          { venue: { venueCountry: country.name } },
          { venue: { venueCountry: { contains: country.name, mode: 'insensitive' } } },
          { venue: { venueCountry: { contains: country.code, mode: 'insensitive' } } }
        ],
        isPublic: true
      }
    })

    console.log(`Single Country ${country.name}: New Count: ${newSystemCount}, Old Count: ${oldSystemCount}`)

    return NextResponse.json({
      ...country,
      eventCount: newSystemCount + oldSystemCount,
      cities: country.cities.map(city => ({
        ...city,
        eventCount: city._count.events
      })),
      debug: {
        newSystemCount,
        oldSystemCount,
        totalEventCount: newSystemCount + oldSystemCount
      }
    })
  } catch (error) {
    console.error("Error fetching country:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT update country
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const flagFile = formData.get('flag') as File | null
    const removeFlag = formData.get('removeFlag') === 'true'
    const currency = formData.get('currency') as string
    const timezone = formData.get('timezone') as string
    const isActive = formData.get('isActive') === 'true'

    // Check if country exists
    const existingCountry = await prisma.country.findUnique({
      where: { id: params.id }
    })

    if (!existingCountry) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      )
    }

    // Check for duplicates
    if ((name && name !== existingCountry.name) || (code && code !== existingCountry.code)) {
      const duplicateCountry = await prisma.country.findFirst({
        where: {
          OR: [
            { name: { equals: name, mode: 'insensitive' } },
            { code: { equals: code?.toUpperCase(), mode: 'insensitive' } }
          ],
          id: { not: params.id }
        }
      })

      if (duplicateCountry) {
        return NextResponse.json(
          { error: "Country with this name or code already exists" },
          { status: 409 }
        )
      }
    }

    let flagUrl = existingCountry.flag
    let flagPublicId = existingCountry.flagPublicId

    // Handle flag removal
    if (removeFlag && existingCountry.flagPublicId) {
      try {
        await deleteFromCloudinary(existingCountry.flagPublicId)
        flagUrl = ""
        flagPublicId = ""
      } catch (error) {
        console.error("Error deleting flag from Cloudinary:", error)
      }
    }

    // Handle new flag upload
    if (flagFile && flagFile.size > 0) {
      // Delete old flag if exists
      if (existingCountry.flagPublicId) {
        try {
          await deleteFromCloudinary(existingCountry.flagPublicId)
        } catch (error) {
          console.error("Error deleting old flag:", error)
        }
      }

      // Upload new flag
      try {
        const uploadResult = await uploadToCloudinary(flagFile, "flags")
        flagUrl = uploadResult.secure_url
        flagPublicId = uploadResult.public_id
      } catch (uploadError) {
        console.error("Error uploading flag:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload flag image" },
          { status: 500 }
        )
      }
    }

    const updatedCountry = await prisma.country.update({
      where: { id: params.id },
      data: {
        name,
        code: code ? code.toUpperCase() : undefined,
        flag: flagUrl,
        flagPublicId,
        currency,
        timezone,
        isActive
      },
      include: {
        cities: {
          where: { isActive: true },
          include: {
            _count: {
              select: { events: true }
            }
          }
        }
      }
    })

    // Get updated event count
    const newSystemCount = await prisma.eventsOnCountries.count({
      where: { countryId: params.id }
    })

    const oldSystemCount = await prisma.event.count({
      where: {
        OR: [
          { venue: { venueCountry: updatedCountry.name } },
          { venue: { venueCountry: { contains: updatedCountry.name, mode: 'insensitive' } } },
          { venue: { venueCountry: { contains: updatedCountry.code, mode: 'insensitive' } } }
        ],
        isPublic: true
      }
    })

    return NextResponse.json({
      ...updatedCountry,
      eventCount: newSystemCount + oldSystemCount,
      cities: updatedCountry.cities.map(city => ({
        ...city,
        eventCount: city._count.events
      }))
    })
  } catch (error) {
    console.error("Error updating country:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE country
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if country exists and has events/cities
    const country = await prisma.country.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            events: true,
            cities: true
          }
        }
      }
    })

    if (!country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      )
    }

    if (country._count.events > 0 || country._count.cities > 0) {
      return NextResponse.json(
        { error: "Cannot delete country with associated events or cities" },
        { status: 400 }
      )
    }

    // Delete flag from Cloudinary if exists
    if (country.flagPublicId) {
      try {
        await deleteFromCloudinary(country.flagPublicId)
      } catch (error) {
        console.error("Error deleting flag from Cloudinary:", error)
      }
    }

    await prisma.country.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Country deleted successfully" })
  } catch (error) {
    console.error("Error deleting country:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}