import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth/next"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePrivate = searchParams.get("includePrivate") === "true"
    const featuredOnly = searchParams.get("featured") === "true"
    const vipOnly = searchParams.get("vip") === "true"

    // Check if requesting private data
    if (includePrivate) {
      const session = await getServerSession(authOptions)

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Build where clause for private events
      const privateWhereClause = {
        OR: [{ organizerId: session.user?.id }, { isPublic: true }],
        ...(featuredOnly && { isFeatured: true }),
        ...(vipOnly && { isVIP: true }),
      }

      // Get all events for authenticated users (organizers can see their own events)
      const events = await prisma.event.findMany({
        where: privateWhereClause,
        include: {
          exhibitionSpaces: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              email: true,
              company:true,
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

    // Build where clause for public events
    const publicWhereClause = {
      isPublic: true,
      ...(featuredOnly && { isFeatured: true }),
      ...(vipOnly && { isVIP: true }),
    }

    // Public events data (no authentication required)
    const events = await prisma.event.findMany({
      where: publicWhereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDescription: true,
        status: true,
        category: true,
        tags: true,
        eventType: true,
        isFeatured: true,  
        isVIP: true,       
        startDate: true,
        endDate: true,
        registrationStart: true,
        registrationEnd: true,
        timezone: true,
        isVirtual: true,
        virtualLink: true,
        // address: true,
        // location: true,
        // city: true,
        // state: true,
        // country: true,
        // zipCode: true,
        maxAttendees: true,
        currentAttendees: true,
        ticketTypes: true,
        currency: true,
        images: true,
        videos: true,
        leads:true,
        documents: true,
        bannerImage: true,
        thumbnailImage: true,
        isPublic: true,
        requiresApproval: true,
        allowWaitlist: true,
        refundPolicy: true,
        metaTitle: true,
        metaDescription: true,
        organizerId: true,
        createdAt: true,
        updatedAt: true,
        averageRating: true,
        totalReviews: true,
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
            company:true,
          },
        },
      // In your GET function, update the venue selection:
venue: {
  select: {
    id: true,
    venueName: true,
    venueAddress: true,
    venueCity: true,
    venueState: true,
    venueCountry: true,
    venueZipCode: true,
    maxCapacity: true,
    totalHalls: true,
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