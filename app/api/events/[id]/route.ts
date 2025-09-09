import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth/next"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    // Check if requesting private data
    if (includePrivate) {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Only organizer or admin can access private data
      const event = await prisma.event.findUnique({
        where: { id },
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
      });

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      // Check if user can access this event's private data
      if (event.organizerId !== session.user?.id && session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({ event }, { status: 200 });
    }

    // Public event data (no authentication required)
    const event = await prisma.event.findFirst({
      where: {
        id,
        isPublic: true, // Only return public events for unauthenticated requests
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
            // Don't include rates for public view
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            avatar: true,
            // Don't include email for public view
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
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Add computed fields for public view
    const eventWithComputedFields = {
      ...event,
      spotsRemaining: event.maxAttendees 
        ? event.maxAttendees - event._count.registrations 
        : null,
      isRegistrationOpen: 
        new Date() >= new Date(event.registrationStart) &&
        new Date() <= new Date(event.registrationEnd),
    };

    return NextResponse.json({ event: eventWithComputedFields }, { status: 200 });

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

