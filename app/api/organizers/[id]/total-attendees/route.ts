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

    // Get all events organized by this organizer
    const events = await prisma.event.findMany({
      where: {
        organizerId: organizerId,
      },
      select: {
        id: true,
        title: true,
      },
    })

    if (events.length === 0) {
      return NextResponse.json({ 
        success: true, 
        totalAttendees: 0,
        eventsCount: 0,
        events: []
      })
    }

    const eventIds = events.map(event => event.id)

    // Get all attendee leads for these events
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
          }
        },
        event: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    // Count by status
    const statusCounts = {
      NEW: attendeeLeads.filter(lead => lead.status === "NEW").length,
      CONTACTED: attendeeLeads.filter(lead => lead.status === "CONTACTED").length,
      QUALIFIED: attendeeLeads.filter(lead => lead.status === "QUALIFIED").length,
      CONVERTED: attendeeLeads.filter(lead => lead.status === "CONVERTED").length,
      FOLLOW_UP: attendeeLeads.filter(lead => lead.status === "FOLLOW_UP").length,
      REJECTED: attendeeLeads.filter(lead => lead.status === "REJECTED").length,
    }

    // Count by event
    const eventWiseCounts = events.map(event => ({
      eventId: event.id,
      eventTitle: event.title,
      count: attendeeLeads.filter(lead => lead.eventId === event.id).length
    }))

    const result = {
      success: true,
      totalAttendees: attendeeLeads.length,
      eventsCount: events.length,
      statusCounts,
      eventWiseCounts,
      events: events.map(event => ({
        id: event.id,
        title: event.title
      })),
      attendees: attendeeLeads.map(lead => ({
        id: lead.id,
        userId: lead.userId,
        firstName: lead.user.firstName,
        lastName: lead.user.lastName,
        email: lead.user.email,
        status: lead.status,
        eventId: lead.event.id,
        eventTitle: lead.event.title,
        registeredAt: lead.createdAt
      }))
    }

    console.log(`Found ${attendeeLeads.length} attendees across ${events.length} events for organizer ${organizerId}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching organizer total attendees:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch total attendees" 
    }, { status: 500 })
  }
}