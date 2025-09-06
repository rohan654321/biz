import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { EventStatus } from "@prisma/client"
import { ObjectId } from "mongodb"; // at top

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify organizer exists and has correct role
    const organizer = await prisma.user.findFirst({
      where: {
        id: id,
        role: "ORGANIZER",
      },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 })
    }

    // Fetch events for this organizer
    const events = await prisma.event.findMany({
      where: {
        organizerId: id,
      },
      include: {
        venue: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
            venueCity: true,
            venueState: true,
            venueCountry: true,
          },
        },
        _count: {
          select: {
            registrations: {
              where: {
                status: "CONFIRMED",
              },
            },
          },
        },
        registrations: {
          where: {
            status: "CONFIRMED",
          },
          include: {
            payment: {
              select: {
                amount: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform events data
    const transformedEvents = events.map((event) => {
      const confirmedRegistrations = event._count.registrations
      const totalRevenue = event.registrations.reduce((sum, reg) => {
        if (reg.payment?.status === "COMPLETED") {
          return sum + (reg.payment.amount || 0)
        }
        return sum + reg.totalAmount
      }, 0)

      return {
        id: Number.parseInt(event.id.slice(-8), 16),
        title: event.title,
        description: event.description || "",
        date: event.startDate.toISOString().split("T")[0],
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        location: event.isVirtual
          ? "Virtual Event"
          : (event.venue ? `${event.venue.firstName} ${event.venue.lastName ?? ""}`.trim() : null) || event.location || `${event.city}, ${event.state}` || event.address || "TBD",
        status:
          event.status === "PUBLISHED"
            ? "Active"
            : event.status === "DRAFT"
              ? "Planning"
              : event.status === "COMPLETED"
                ? "Completed"
                : "Cancelled",
        attendees: confirmedRegistrations,
        registrations: confirmedRegistrations,
        revenue: totalRevenue,
        type: event.category || "Conference",
        maxAttendees: event.maxAttendees,
        isVirtual: event.isVirtual || false,
        bannerImage: event.bannerImage,
        thumbnailImage: event.thumbnailImage,
        isPublic: event.isPublic || true,
      }
    })

    return NextResponse.json({ events: transformedEvents })
  } catch (error) {
    console.error("Error fetching organizer events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is authorized to create events for this organizer
    if (session.user?.id !== id && session.user?.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Create new event in database
    const newEvent = await prisma.event.create({
  data: {
    id: new ObjectId().toHexString(), // 👈 add this
    title: body.title,
    description: body.description,
    shortDescription: body.shortDescription,
    slug:
      (body.slug ??
        body.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")),
    status: (body.status?.toUpperCase() as EventStatus) || EventStatus.DRAFT,
    category: body.category,
    tags: body.tags || [],
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    registrationStart: new Date(body.registrationStart || body.startDate),
    registrationEnd: new Date(body.registrationEnd || body.endDate),
    timezone: body.timezone || "UTC",
    isVirtual: body.isVirtual || false,
    virtualLink: body.virtualLink,
    address: body.address,
    location: body.location,
    city: body.city,
    state: body.state,
    country: body.country,
    zipCode: body.zipCode,
    maxAttendees: body.maxAttendees,
    ticketTypes: body.ticketTypes || [],
    currency: body.currency || "USD",
    images: body.images || [],
    bannerImage: body.bannerImage,
    thumbnailImage: body.thumbnailImage,
    isPublic: body.isPublic !== false,
    requiresApproval: body.requiresApproval || false,
    allowWaitlist: body.allowWaitlist || false,
    refundPolicy: body.refundPolicy,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    organizerId: id,
  },
  select: {
    id: true,
    title: true,
    description: true,
    status: true,
    startDate: true,
    endDate: true,
    createdAt: true,
  },
});

    // Update organizer's total events count
    await prisma.user.update({
      where: { id: id },
      data: {
        totalEvents: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: newEvent,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}