import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ✅ Next.js 15: params is now a Promise, so we need to await it
    const { id: organizerId } = await params

    console.log("Fetching total attendees for organizer:", organizerId)

    if (!organizerId) {
      console.error("Organizer ID is missing")
      return NextResponse.json(
        { success: false, error: "Organizer ID is required" },
        { status: 400 }
      )
    }

    // ✅ Step 1: Get all events owned by this specific organizer
    const events = await prisma.event.findMany({
      where: { 
        organizerId: organizerId
      },
      select: { id: true, title: true },
    })

    console.log(`Found ${events.length} events for organizer ${organizerId}`)

    if (events.length === 0) {
      console.log(`No events found for organizer ${organizerId}, returning empty data`)
      return NextResponse.json({
        success: true,
        totalAttendees: 0,
        eventsCount: 0,
        statusCounts: {
          NEW: 0,
          CONTACTED: 0,
          QUALIFIED: 0,
          CONVERTED: 0,
          FOLLOW_UP: 0,
          REJECTED: 0,
        },
        eventWiseCounts: [],
        events: [],
        attendees: [],
      })
    }

    const eventIds = events.map((e) => e.id)
    console.log(`Event IDs for organizer ${organizerId}:`, eventIds)

    // ✅ Step 2: Only fetch attendee leads for this organizer's specific events
    const attendeeLeads = await prisma.eventLead.findMany({
      where: {
        eventId: {
          in: eventIds
        },
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
            organizerId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    console.log(`Found ${attendeeLeads.length} attendee leads for organizer ${organizerId}`)

    // ✅ Additional verification: Ensure all leads belong to this organizer
    const verifiedLeads = attendeeLeads.filter(lead => {
      const event = events.find(e => e.id === lead.event.id)
      if (!event) {
        console.log(`Filtering out lead ${lead.id} - event ${lead.event.id} not found in organizer's events`)
        return false
      }
      return true
    })

    console.log(`After verification: ${verifiedLeads.length} attendee leads`)

    // ✅ Step 3: Calculate stats using verified leads only
    const statusCounts = {
      NEW: verifiedLeads.filter((l) => l.status === "NEW").length,
      CONTACTED: verifiedLeads.filter((l) => l.status === "CONTACTED").length,
      QUALIFIED: verifiedLeads.filter((l) => l.status === "QUALIFIED").length,
      CONVERTED: verifiedLeads.filter((l) => l.status === "CONVERTED").length,
      FOLLOW_UP: verifiedLeads.filter((l) => l.status === "FOLLOW_UP").length,
      REJECTED: verifiedLeads.filter((l) => l.status === "REJECTED").length,
    }

    const eventWiseCounts = events.map((event) => ({
      eventId: event.id,
      eventTitle: event.title,
      count: verifiedLeads.filter((l) => l.event.id === event.id).length,
    }))

    return NextResponse.json({
      success: true,
      totalAttendees: verifiedLeads.length,
      eventsCount: events.length,
      statusCounts,
      eventWiseCounts,
      events,
      attendees: verifiedLeads.map((lead) => ({
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