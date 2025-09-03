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

    // Query database
    const venueManager = await prisma.user.findFirst({
      where: {
        id,
        role: "VENUE_MANAGER",
      },
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
    mobile: venueManager.phone,
    address: venueManager.location || "",
    website: venueManager.website || "",
    description: venueManager.bio || "",
    maxCapacity: venueManager.maxCapacity || 0,
    totalHalls: venueManager.totalHalls || 0,
    totalEvents: venueManager.totalEvents || 0,
    activeBookings: venueManager.activeBookings || 0,
    averageRating: venueManager.averageRating || 0,
    totalReviews: venueManager.totalReviews || 0,
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
