import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Only VIP + Public events (no authentication required)
    const vipEvents = await prisma.event.findMany({
      where: {
        // isPublic: true,
        isVIP: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        slug: true,
        startDate: true,
        endDate: true,
        bannerImage: true,
        city: true,
        country: true,
        maxAttendees: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Add computed fields
    const eventsWithComputedFields = vipEvents.map((event) => ({
      ...event,
      spotsRemaining: event.maxAttendees
        ? event.maxAttendees - event._count.registrations
        : null,
      isRegistrationOpen:
        new Date() >= new Date(event.startDate) &&
        new Date() <= new Date(event.endDate),
    }))

    return NextResponse.json({ events: eventsWithComputedFields }, { status: 200 })
  } catch (error) {
    console.error("Error fetching VIP events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
