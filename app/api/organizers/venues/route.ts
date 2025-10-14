import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const country = searchParams.get("country")
    const search = searchParams.get("search")

const venues = await prisma.user.findMany({
  where: {
    AND: [
      { role: "VENUE_MANAGER" },
      { isActive: true },
      city ? { location: { contains: city, mode: "insensitive" } } : {},
      search
        ? {
            OR: [
              { company: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
              { bio: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    isVerified: true,
    avatar: true,
    venueName: true,
    venueDescription: true,
    venueAddress: true,
    maxCapacity: true,
    totalHalls: true,
    averageRating: true,
    totalReviews: true,
    amenities: true,
    venueCurrency: true,
    createdAt: true,
  },
  orderBy: { createdAt: "desc" },
})

const venuesWithRating = venues.map((venue) => ({
  id: venue.id,
  name: venue.venueName || "Unnamed Venue",
  description: venue.venueDescription || "",
  location: {
    address: venue.venueAddress || "Address not available",
    city: "",
    state: "",
    country: "",
  },
  capacity: venue.maxCapacity ?? 0,
  totalHalls: venue.totalHalls ?? 0,
  rating: venue.averageRating ?? 0,
  reviewCount: venue.totalReviews ?? 0,
  images: venue.avatar ? [venue.avatar] : [],
  amenities: venue.amenities || [],
  currency: venue.venueCurrency || "USD",
  isVerified: venue.isVerified || false,
  manager: {
    name: `${venue.firstName} ${venue.lastName}`.trim(),
    phone: venue.phone || "",
    email: venue.email,
  },
  createdAt: venue.createdAt,
}))


    console.log("[v0] Found venues:", venuesWithRating.length)
    return NextResponse.json(venuesWithRating)
  } catch (error) {
    console.error("[v0] Error fetching venues:", error)
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { organizerId, venueIds } = body

    console.log("[v0] Adding existing venues to organizer network")
    console.log("[v0] Organizer ID:", organizerId)
    console.log("[v0] Venue IDs:", venueIds)

    // Validate required fields
    if (!organizerId) {
      return NextResponse.json({ success: false, error: "Organizer ID is required" }, { status: 400 })
    }

    if (!venueIds || !Array.isArray(venueIds) || venueIds.length === 0) {
      return NextResponse.json({ success: false, error: "Venue IDs are required" }, { status: 400 })
    }

    // Verify organizer exists and is an ORGANIZER
    const organizer = await prisma.user.findFirst({
      where: {
        id: organizerId,
        role: "ORGANIZER",
      },
    })

    if (!organizer) {
      return NextResponse.json({ success: false, error: "Organizer not found" }, { status: 404 })
    }

    // Verify all venues exist and are VENUE_MANAGERs
    const venues = await prisma.user.findMany({
      where: {
        id: { in: venueIds },
        role: "VENUE_MANAGER",
      },
    })

    if (venues.length !== venueIds.length) {
      return NextResponse.json({ success: false, error: "Some venues not found or invalid" }, { status: 404 })
    }

    // Update venues to link them to the organizer
    const updatedVenues = await prisma.user.updateMany({
      where: {
        id: { in: venueIds },
        role: "VENUE_MANAGER",
      },
      data: {
        organizerIdForVenueManager: organizerId,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: `${updatedVenues.count} venue(s) added to organizer network`,
        data: { updatedCount: updatedVenues.count },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error adding venues to organizer network:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
