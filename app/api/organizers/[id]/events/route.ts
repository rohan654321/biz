import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: organizerId } = await context.params

    if (!organizerId || organizerId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(organizerId)) {
      return NextResponse.json({ error: "Invalid organizer ID format" }, { status: 400 })
    }

    // Verify organizer exists and is an ORGANIZER
    const organizer = await prisma.user.findFirst({
      where: {
        id: organizerId,
        role: "ORGANIZER",
        isActive: true,
      },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 })
    }

    // Fetch events organized by this organizer
    const events = await prisma.event.findMany({
      where: {
        organizerId: organizerId,
        status: {
          in: ["DRAFT", "PUBLISHED"], // Only active events
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
        location: true,
        city: true,
        maxAttendees: true,
        currentAttendees: true,
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Format dates for frontend consumption
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      status: event.status,
      location: event.location,
      city: event.city,
      maxAttendees: event.maxAttendees,
      currentAttendees: event.currentAttendees,
    }))

    return NextResponse.json({
      events: formattedEvents,
      total: formattedEvents.length,
    })
  } catch (error) {
    console.error("Error fetching organizer events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
