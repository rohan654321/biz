import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } =await params

    // Validate ObjectId format for MongoDB
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            organizationName: true,
            description: true,
          },
        },
        venue: {
          select: {
            id: true,
            venueName: true,
            venueAddress: true,
            venueCity: true,
            venueState: true,
            venueCountry: true,
            maxCapacity: true,
            amenities: true,
            averageRating: true,
          },
        },
        ticketTypes: {
          where: {
            isActive: true,
          },
          orderBy: {
            price: "asc",
          },
        },
        speakerSessions: {
          include: {
            speaker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                company: true,
                jobTitle: true,
              },
            },
          },
          orderBy: {
            startTime: "asc",
          },
        },
        exhibitionSpaces: {
          where: {
            isAvailable: true,
          },
        },
        _count: {
          select: {
            registrations: true,
            reviews: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Calculate availability
    const availableTickets = event.ticketTypes.reduce((total, ticket) => {
      return total + (ticket.quantity - ticket.sold)
    }, 0)

    // Format response
    const eventData = {
      ...event,
      availableTickets,
      isAvailable: availableTickets > 0 && new Date() < event.registrationEnd,
      registrationCount: event._count.registrations,
      reviewCount: event._count.reviews,
    }

    return NextResponse.json(eventData)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
