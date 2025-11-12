import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"

// GET all countries
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeCounts = searchParams.get('includeCounts') === 'true'

    const countries = await prisma.country.findMany({
      include: {
        cities: {
          where: { isActive: true },
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            events: true,
            cities: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    let countriesWithData = countries

    if (includeCounts) {
      const countriesWithEventCounts = await Promise.all(
        countries.map(async (country) => {
          try {
            // Count from new system (EventsOnCountries)
            const newSystemCount = await prisma.eventsOnCountries.count({
              where: { countryId: country.id }
            })

            // Count from old system (events with venue in this country)
            // Try different possible country name formats
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

            console.log(`Country: ${country.name}, New Count: ${newSystemCount}, Old Count: ${oldSystemCount}`)

            const totalEventCount = newSystemCount + oldSystemCount
            
            return {
              ...country,
              eventCount: totalEventCount,
              cityCount: country._count.cities,
              debug: {
                newSystemCount,
                oldSystemCount,
                totalEventCount
              }
            }
          } catch (countError) {
            console.error(`Error counting events for country ${country.name}:`, countError)
            return {
              ...country,
              eventCount: 0,
              cityCount: country._count.cities,
            //   debug: { error: countError.message }
            }
          }
        })
      )

      countriesWithData = countriesWithEventCounts
    }

    return NextResponse.json(countriesWithData)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST create new country
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const flagFile = formData.get('flag') as File | null
    const currency = formData.get('currency') as string
    const timezone = formData.get('timezone') as string
    const isActive = formData.get('isActive') === 'true'

    if (!name || !code) {
      return NextResponse.json(
        { error: "Country name and code are required" },
        { status: 400 }
      )
    }

    // Check if country already exists
    const existingCountry = await prisma.country.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { code: { equals: code.toUpperCase(), mode: 'insensitive' } }
        ]
      }
    })

    if (existingCountry) {
      return NextResponse.json(
        { error: "Country with this name or code already exists" },
        { status: 409 }
      )
    }

    let flagUrl = ""
    let flagPublicId = ""

    // Upload flag image to Cloudinary if provided
    if (flagFile && flagFile.size > 0) {
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

    const country = await prisma.country.create({
      data: {
        name,
        code: code.toUpperCase(),
        flag: flagUrl,
        // flagPublicId,
        currency,
        timezone,
        isActive
      },
      include: {
        _count: {
          select: {
            events: true,
            cities: true
          }
        }
      }
    })

    return NextResponse.json({
      ...country,
      eventCount: 0,
      cityCount: 0
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating country:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}