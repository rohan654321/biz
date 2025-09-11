import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth/next"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePrivate = searchParams.get("includePrivate") === "true"

    // Check if requesting private data
    if (includePrivate) {
      const session = await getServerSession(authOptions)

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Get all events for authenticated users (organizers can see their own events)
      const events = await prisma.event.findMany({
        where: {
          OR: [{ organizerId: session.user?.id }, { isPublic: true }],
        },
        include: {
          exhibitionSpaces: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              email: true,
              avatar: true,
            },
          },
          venue: true,
          registrations: {
            select: {
              id: true,
              status: true,
              registeredAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  email: true,
                },
              },
            },
          },
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

      return NextResponse.json({ events }, { status: 200 })
    }

    // Public events data (no authentication required)
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
      },
      include: {
        exhibitionSpaces: {
          select: {
            id: true,
            name: true,
            description: true,
            basePrice: true,
            pricePerSqm: true,
            minArea: true,
            isFixed: true,
            unit: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            avatar: true,
          },
        },
        venue: {
          select: {
            id: true,
            firstName: true,
            location: true,
            venueCity: true,
            venueState: true,
            venueCountry: true,
          },
        },
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

    // Add computed fields for public view
    const eventsWithComputedFields = events.map((event) => ({
      ...event,
      spotsRemaining: event.maxAttendees ? event.maxAttendees - event._count.registrations : null,
      isRegistrationOpen:
        new Date() >= new Date(event.registrationStart) && new Date() <= new Date(event.registrationEnd),
    }))

    return NextResponse.json({ events: eventsWithComputedFields }, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
