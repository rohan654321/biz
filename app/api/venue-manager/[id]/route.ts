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
        meetingSpaces: true,
        venueReviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    })

    if (!venueManager) {
      return NextResponse.json({ success: false, error: "Venue manager not found" }, { status: 404 })
    }

    // Return data in the structure expected by the frontend
    return NextResponse.json({
      success: true,
      data: {
        id: venueManager.id,
        name: venueManager.venueName || venueManager.company || "Unnamed Venue",
        description: venueManager.venueDescription || venueManager.bio || "No description available",
        manager: {
          id: venueManager.id,
          name: `${venueManager.firstName} ${venueManager.lastName}`.trim(),
          email: venueManager.email,
          phone: venueManager.phone || "",
          avatar: venueManager.avatar || "/placeholder.svg",
          isVerified: venueManager.isVerified,
          bio: venueManager.bio || "",
          website: venueManager.website || "",
          address: venueManager.venueAddress || "",
          description: venueManager.venueDescription || "",
          venueName: venueManager.venueName || "Unnamed Venue",
        },
        location: {
          address: venueManager.venueAddress || "",
          city: venueManager.venueCity || "",
          state: venueManager.venueState || "",
          country: venueManager.venueCountry || "",
          zipCode: venueManager.venueZipCode || "",
          coordinates: {
            lat: venueManager.latitude || 0,
            lng: venueManager.longitude || 0,
          },
        },
        contact: {
          phone: venueManager.venuePhone || venueManager.phone || "",
          email: venueManager.venueEmail || venueManager.email,
          website: venueManager.venueWebsite || venueManager.website || "",
        },
        capacity: {
          total: venueManager.maxCapacity || 0,
          halls: venueManager.totalHalls || 0,
        },
        pricing: {
          basePrice: venueManager.basePrice || 0,
          currency: venueManager.venueCurrency || "₹",
        },
        stats: {
          averageRating: venueManager.averageRating || 0,
          totalReviews: venueManager.totalReviews || 0,
          activeBookings: venueManager.activeBookings || 0,
          totalEvents: venueManager.totalEvents || 0,
        },
        amenities: venueManager.amenities || [],
        images: venueManager.venueImages || [],
        videos: venueManager.venueVideos || [],
        floorPlans: venueManager.floorPlans || [],
        virtualTour: venueManager.virtualTour || "",
        meetingSpaces: venueManager.meetingSpaces || [],
        reviews: venueManager.venueReviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          user: {
            name: `${review.user.firstName} ${review.user.lastName}`.trim(),
            avatar: review.user.avatar || "/placeholder.svg",
          },
        })),
        createdAt: venueManager.createdAt.toISOString(),
        updatedAt: venueManager.updatedAt.toISOString(),
      },
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
      return NextResponse.json({ success: false, error: "Invalid venue manager ID" }, { status: 400 })
    }

    const {
      venueName,
      logo,
      contactPerson,
      email,
      mobile,
      address,
      city,
      state,
      country,
      zipCode,
      website,
      description,
      maxCapacity,
      totalHalls,
      activeBookings,
      averageRating,
      totalReviews,
      amenities,
      meetingSpaces,
      venueImages,
      venueVideos,
      floorPlans,
      virtualTour,
      latitude,
      longitude,
      basePrice,
      currency,
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
          venueName,
          company: venueName,
          avatar: logo,
          firstName,
          lastName,
          email,
          phone: mobile,
          venueAddress: address,
          venueCity: city,
          venueState: state,
          venueCountry: country,
          venueZipCode: zipCode,
          website,
          venueDescription: description,
          bio: description,
          maxCapacity: maxCapacity ? Number.parseInt(maxCapacity) : undefined,
          totalHalls: totalHalls ? Number.parseInt(totalHalls) : undefined,
          activeBookings: activeBookings ? Number.parseInt(activeBookings) : undefined,
          averageRating: averageRating ? Number.parseFloat(averageRating) : undefined,
          totalReviews: totalReviews ? Number.parseInt(totalReviews) : undefined,
          amenities: amenities || undefined,
          venueImages: venueImages || undefined,
          venueVideos: venueVideos || undefined,
          floorPlans: floorPlans || undefined,
          virtualTour: virtualTour || undefined,
          latitude: latitude ? Number.parseFloat(latitude) : undefined,
          longitude: longitude ? Number.parseFloat(longitude) : undefined,
          basePrice: basePrice ? Number.parseFloat(basePrice) : undefined,
          venueCurrency: currency || undefined,
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
                isAvailable: space.isAvailable !== false,
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
        venueName: result.updatedVenue.venueName || result.updatedVenue.company || "",
        logo: result.updatedVenue.avatar || "",
        contactPerson: `${result.updatedVenue.firstName} ${result.updatedVenue.lastName}`.trim(),
        email: result.updatedVenue.email,
        mobile: result.updatedVenue.phone || "",
        address: result.updatedVenue.venueAddress || "",
        city: result.updatedVenue.venueCity || "",
        state: result.updatedVenue.venueState || "",
        country: result.updatedVenue.venueCountry || "",
        zipCode: result.updatedVenue.venueZipCode || "",
        website: result.updatedVenue.website || "",
        description: result.updatedVenue.venueDescription || result.updatedVenue.bio || "",
        maxCapacity: result.updatedVenue.maxCapacity || 0,
        totalHalls: result.updatedVenue.totalHalls || 0,
        totalEvents: result.updatedVenue.totalEvents || 0,
        activeBookings: result.updatedVenue.activeBookings || 0,
        averageRating: result.updatedVenue.averageRating || 0,
        totalReviews: result.updatedVenue.totalReviews || 0,
        amenities: result.updatedVenue.amenities || [],
        meetingSpaces: result.meetingSpaces,
        venueImages: result.updatedVenue.venueImages || [],
        venueVideos: result.updatedVenue.venueVideos || [],
        floorPlans: result.updatedVenue.floorPlans || [],
        virtualTour: result.updatedVenue.virtualTour || "",
        latitude: result.updatedVenue.latitude || 0,
        longitude: result.updatedVenue.longitude || 0,
        basePrice: result.updatedVenue.basePrice || 0,
        currency: result.updatedVenue.venueCurrency || "₹",
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

    const {
      venueName,
      logo,
      contactPerson,
      email,
      mobile,
      venueAddress,
      venueCity,
      venueState,
      venueZipCode,
      venueCountry,
      website,
      venueDescription,
      maxCapacity,
      totalHalls,
      activeBookings,
      averageRating,
      totalReviews,
      amenities,
      meetingSpaces,
    } = body

    if (!organizerId) {
      console.log("[v0] Validation failed: Organizer ID is required")
      return NextResponse.json({ success: false, error: "Organizer ID is required" }, { status: 400 })
    }

    if (!venueName) {
      console.log("[v0] Validation failed: Venue name is required")
      return NextResponse.json({ success: false, error: "Venue name is required" }, { status: 400 })
    }

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

    let firstName = ""
    let lastName = ""
    if (contactPerson) {
      const parts = contactPerson.split(" ")
      firstName = parts[0] || ""
      lastName = parts.slice(1).join(" ") || ""
    }

    const result = await prisma.$transaction(async (tx) => {
      let emailToUse = email

      if (!email) {
        const venueCount = await prisma.user.count({
          where: { role: "VENUE_MANAGER" },
        })
        emailToUse = `venue${venueCount + 1}@gmail.com`
      }

      const newVenueManager = await tx.user.create({
        data: {
          role: "VENUE_MANAGER",
          email: emailToUse,
          firstName: firstName || venueName || "Venue",
          lastName: lastName || "Manager",
          password: "TEMP_PASSWORD",
          venueName,
          company: venueName || null,
          avatar: logo || null,
          phone: mobile || null,
          venueAddress: venueAddress || null,
          venueCity: venueCity || null,
          venueCountry: venueCountry || null,
          venueState: venueState || null,
          venueZipCode: venueZipCode || null,
          website: website || null,
          venueDescription: venueDescription || null,
          bio: venueDescription || null,
          maxCapacity: maxCapacity ? Number.parseInt(maxCapacity) : 0,
          totalHalls: totalHalls ? Number.parseInt(totalHalls) : 0,
          activeBookings: activeBookings ? Number.parseInt(activeBookings) : 0,
          averageRating: averageRating ? Number.parseFloat(averageRating) : 0,
          totalReviews: totalReviews ? Number.parseInt(totalReviews) : 0,
          amenities: amenities || [],
          organizerIdForVenueManager: organizerId,
        },
      })

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

    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
