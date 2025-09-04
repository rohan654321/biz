import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ID
    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, error: "Invalid venuemanager ID" },
        { status: 400 }
      )
    }

    // Query database with meeting spaces included
    const venueManager = await prisma.user.findFirst({
      where: {
        id,
        role: "VENUE_MANAGER",
      },
      include: {
        meetingSpaces: true // Include related meeting spaces
      }
    })

    if (!venueManager) {
      return NextResponse.json(
        { success: false, error: "venuemanager not found" },
        { status: 404 }
      )
    }

    // Return profile
    return NextResponse.json({
      success: true,
      venue: {
        id: venueManager.id,
        venueName: venueManager.company || "",
        logo: venueManager.avatar || "",
        contactPerson: `${venueManager.firstName} ${venueManager.lastName}`.trim(),
        email: venueManager.email,
        mobile: venueManager.phone || "",
        address: venueManager.location || "",
        website: venueManager.website || "",
        description: venueManager.bio || "",
        maxCapacity: venueManager.maxCapacity || 0,
        totalHalls: venueManager.totalHalls || 0,
        totalEvents: venueManager.totalEvents || 0,
        activeBookings: venueManager.activeBookings || 0,
        averageRating: venueManager.averageRating || 0,
        totalReviews: venueManager.totalReviews || 0,
        amenities: venueManager.amenities || [],
        meetingSpaces: venueManager.meetingSpaces || [], // Now properly structured
      },
    })

  } catch (error) {
    console.error("Error in venue API:", error)
    return NextResponse.json(
      { success: false, error: "Internal venue error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, error: "Invalid venuemanager ID" },
        { status: 400 }
      )
    }

    const {
      venueName,
      logo,
      contactPerson,
      email,
      mobile,
      address,
      website,
      description,
      maxCapacity,
      totalHalls,
      activeBookings,
      averageRating,
      totalReviews,
      amenities,
      meetingSpaces, // Array of meeting space objects
    } = body

    // Split contactPerson into first/last name
    let firstName = ""
    let lastName = ""
    if (contactPerson) {
      const parts = contactPerson.split(" ")
      firstName = parts[0] || ""
      lastName = parts.slice(1).join(" ") || ""
    }

    // Use a transaction to update user and meeting spaces
    const result = await prisma.$transaction(async (tx) => {
      // Update the user
      const updatedVenue = await tx.user.update({
        where: { id },
        data: {
          company: venueName,
          avatar: logo,
          firstName,
          lastName,
          email,
          phone: mobile,
          location: address,
          website,
          bio: description,
          maxCapacity,
          totalHalls,
          activeBookings,
          averageRating,
          totalReviews,
          amenities,
        },
      })

      // Delete existing meeting spaces
      await tx.meetingSpace.deleteMany({
        where: { userId: id }
      })

      // Create new meeting spaces if provided
      let createdMeetingSpaces = []
      if (meetingSpaces && meetingSpaces.length > 0) {
        createdMeetingSpaces = await Promise.all(
          meetingSpaces.map((space: any) => 
            tx.meetingSpace.create({
              data: {
                name: space.name || "",
                capacity: space.capacity || 0,
                area: space.area || 0,
                hourlyRate: space.hourlyRate || 0,
                isAvailable: space.isAvailable !== false, // Default to true
                userId: id,
              }
            })
          )
        )
      }

      return { updatedVenue, meetingSpaces: createdMeetingSpaces }
    })

    return NextResponse.json({
      success: true,
      venue: {
        id: result.updatedVenue.id,
        venueName: result.updatedVenue.company || "",
        logo: result.updatedVenue.avatar || "",
        contactPerson: `${result.updatedVenue.firstName} ${result.updatedVenue.lastName}`.trim(),
        email: result.updatedVenue.email,
        mobile: result.updatedVenue.phone || "",
        address: result.updatedVenue.location || "",
        website: result.updatedVenue.website || "",
        description: result.updatedVenue.bio || "",
        maxCapacity: result.updatedVenue.maxCapacity || 0,
        totalHalls: result.updatedVenue.totalHalls || 0,
        totalEvents: result.updatedVenue.totalEvents || 0,
        activeBookings: result.updatedVenue.activeBookings || 0,
        averageRating: result.updatedVenue.averageRating || 0,
        totalReviews: result.updatedVenue.totalReviews || 0,
        amenities: result.updatedVenue.amenities || [],
        meetingSpaces: result.meetingSpaces,
      },
    })
  } catch (error) {
    console.error("Error in venue PUT API:", error)
    return NextResponse.json(
      { success: false, error: "Internal venue error" },
      { status: 500 }
    )
  }
}