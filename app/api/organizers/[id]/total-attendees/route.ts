import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizerId: string }> }
) {
  try {
    const { organizerId } = await params

    console.log("Fetching total attendees for organizer:", organizerId)

    // ✅ Step 1: Get all events for this organizer
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true, title: true },
    })

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        totalAttendees: 0,
        eventsCount: 0,
        statusCounts: {},
        eventWiseCounts: [],
        events: [],
        attendees: [],
      })
    }

    const eventIds = events.map((event) => event.id)

    // ✅ Step 2: Get all attendee leads linked to those eventIds
    const attendeeLeads = await prisma.eventLead.findMany({
      where: {
        eventId: { in: eventIds },
        type: "ATTENDEE",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            organizerId: true, // ✅ keep track for sanity
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // ✅ Step 3: Ensure data belongs only to this organizer
    const filteredLeads = attendeeLeads.filter(
      (lead) => lead.event.organizerId === organizerId
    )

    // ✅ Step 4: Count stats
    const statusCounts = {
      NEW: filteredLeads.filter((lead) => lead.status === "NEW").length,
      CONTACTED: filteredLeads.filter((lead) => lead.status === "CONTACTED").length,
      QUALIFIED: filteredLeads.filter((lead) => lead.status === "QUALIFIED").length,
      CONVERTED: filteredLeads.filter((lead) => lead.status === "CONVERTED").length,
      FOLLOW_UP: filteredLeads.filter((lead) => lead.status === "FOLLOW_UP").length,
      REJECTED: filteredLeads.filter((lead) => lead.status === "REJECTED").length,
    }

    const eventWiseCounts = events.map((event) => ({
      eventId: event.id,
      eventTitle: event.title,
      count: filteredLeads.filter((lead) => lead.eventId === event.id).length,
    }))

    return NextResponse.json({
      success: true,
      totalAttendees: filteredLeads.length,
      eventsCount: events.length,
      statusCounts,
      eventWiseCounts,
      events: events.map((event) => ({ id: event.id, title: event.title })),
      attendees: filteredLeads.map((lead) => ({
        id: lead.id,
        userId: lead.user.id,
        firstName: lead.user.firstName,
        lastName: lead.user.lastName,
        email: lead.user.email,
        status: lead.status,
        eventId: lead.event.id,
        eventTitle: lead.event.title,
        registeredAt: lead.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching organizer total attendees:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch total attendees" },
      { status: 500 }
    )
  }
}
