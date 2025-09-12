import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Validate ID
    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, error: "Invalid venue manager ID" }, { status: 400 })
    }

    // Query database with meeting spaces included
    const venueManager = await prisma.user.findFirst({
      where: {
        id,
        role: "VENUE_MANAGER",
      },
      include: {
        meetingSpaces: true, // Include related meeting spaces
      },
    })

    if (!venueManager) {
      return NextResponse.json({ success: false, error: "Venue manager not found" }, { status: 404 })
    }

    const transformedVenue = {
      id: venueManager.id,
      name: venueManager.company || "Unnamed Venue",
      description: venueManager.bio || "No description available",
      manager: {
        id: venueManager.id,
        name: `${venueManager.firstName} ${venueManager.lastName}`.trim(),
        email: venueManager.email,
        phone: venueManager.phone || "",
        avatar: venueManager.avatar || "",
        isVerified: true,
        bio: venueManager.bio || "",
        website: venueManager.website || "",
      },
      location: {
        address: venueManager.location || "",
        city: venueManager.location?.split(",")[1]?.trim() || "",
        state: venueManager.location?.split(",")[2]?.trim() || "",
        country: venueManager.location?.split(",")[3]?.trim() || "",
        zipCode: "",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      contact: {
        phone: venueManager.phone || "",
        email: venueManager.email,
        website: venueManager.website || "",
      },
      capacity: {
        total: venueManager.maxCapacity || 0,
        halls: venueManager.totalHalls || 0,
      },
      pricing: {
        basePrice: 1000, // Default base price
        currency: "$",
      },
      stats: {
        averageRating: venueManager.averageRating || 0,
        totalReviews: venueManager.totalReviews || 0,
        activeBookings: venueManager.activeBookings || 0,
      },
      amenities: venueManager.amenities || [],
      images: [venueManager.avatar || "/placeholder.svg?height=400&width=800&text=Venue+Image"],
      videos: [],
      floorPlans: [],
      virtualTour: "",
      meetingSpaces: venueManager.meetingSpaces || [],
      reviews: [], // Empty for now
      bookings: [], // Empty for now
      events: [], // Empty for now
      organizer: null,
      createdAt: venueManager.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: venueManager.updatedAt?.toISOString() || new Date().toISOString(),
    }

    // Return transformed data structure
    return NextResponse.json({
      success: true,
      data: transformedVenue,
    })
  } catch (error) {
    console.error("Error in venue API:", error)
    return NextResponse.json({ success: false, error: "Internal venue error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, error: "Invalid venuemanager ID" }, { status: 400 })
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
        where: { userId: id },
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
              },
            }),
          ),
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
    return NextResponse.json({ success: false, error: "Internal venue error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: organizerId } = await params
    const body = await req.json()

    console.log("[v0] POST request received for organizer:", organizerId)
    console.log("[v0] Request body:", body)

    // Extract venue manager data from the request
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
      meetingSpaces,
    } = body

    // Validate required fields
    if (!email) {
      console.log("[v0] Validation failed: Email is required")
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    if (!organizerId) {
      console.log("[v0] Validation failed: Organizer ID is required")
      return NextResponse.json({ success: false, error: "Organizer ID is required" }, { status: 400 })
    }

    if (!venueName) {
      console.log("[v0] Validation failed: Venue name is required")
      return NextResponse.json({ success: false, error: "Venue name is required" }, { status: 400 })
    }

    // Verify organizer exists and is an ORGANIZER
    const organizer = await prisma.user.findFirst({
      where: {
        id: organizerId,
        role: "ORGANIZER",
      },
    })

    if (!organizer) {
      console.log("[v0] Organizer not found or invalid role")
      return NextResponse.json({ success: false, error: "Organizer not found" }, { status: 404 })
    }

    // Split contactPerson into first/last name
    let firstName = ""
    let lastName = ""
    if (contactPerson) {
      const parts = contactPerson.split(" ")
      firstName = parts[0] || ""
      lastName = parts.slice(1).join(" ") || ""
    }

    // Use transaction to create venue manager and link to organizer
    const result = await prisma.$transaction(async (tx) => {
      // Create the venue manager user with just the ID reference
      const newVenueManager = await tx.user.create({
        data: {
          role: "VENUE_MANAGER",
          email: email,
          firstName: firstName || "Venue",
          lastName: lastName || "Manager",
          password: "TEMP_PASSWORD",
          company: venueName || null,
          avatar: logo || null,
          phone: mobile || null,
          location: address || null,
          website: website || null,
          bio: description || null,
          maxCapacity: maxCapacity ? Number.parseInt(maxCapacity) : 0,
          totalHalls: totalHalls ? Number.parseInt(totalHalls) : 0,
          activeBookings: activeBookings ? Number.parseInt(activeBookings) : 0,
          averageRating: averageRating ? Number.parseFloat(averageRating) : 0,
          totalReviews: totalReviews ? Number.parseInt(totalReviews) : 0,
          amenities: amenities || [],
          // Use only the ID field, not the relation object
          organizerIdForVenueManager: organizerId,
        },
      })

      // Create meeting spaces if provided
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
                isAvailable: space.isAvailable !== false,
                userId: newVenueManager.id,
              },
            }),
          ),
        )
      }

      return { venueManager: newVenueManager, meetingSpaces: createdMeetingSpaces }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Venue manager created and added to organizer network",
        data: result,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error in venue manager POST API:", error)

    // Handle unique constraint violation (duplicate email)
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
