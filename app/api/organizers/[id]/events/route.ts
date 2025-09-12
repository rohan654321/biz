// app/api/organizers/[id]/events/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { EventStatus } from "@prisma/client"
import { ObjectId } from "mongodb"

// ✅ GET Handler
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params // Await the params promise

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizer = await prisma.user.findFirst({
      where: {
        id,
        role: "ORGANIZER",
      },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 })
    }

    const events = await prisma.event.findMany({
      where: { organizerId: id },
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
        exhibitionSpaces: true,
        _count: {
          select: {
            registrations: {
              where: { status: "CONFIRMED" },
            },
          },
        },
        registrations: {
          where: { status: "CONFIRMED" },
          include: {
            payment: {
              select: { amount: true, status: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const transformedEvents = events.map((event) => {
      const confirmedRegistrations = event._count.registrations
      const totalRevenue = event.registrations.reduce((sum, reg) => {
        if (reg.payment?.status === "COMPLETED") {
          return sum + (reg.payment.amount || 0)
        }
        return sum + reg.totalAmount
      }, 0)

      return {
        id: event.id,
        title: event.title,
        description: event.description || "",
        date: event.startDate.toISOString().split("T")[0],
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        location: event.isVirtual
          ? "Virtual Event"
          : (event.venue ? `${event.venue.firstName} ${event.venue.lastName ?? ""}`.trim() : null) ||
            event.location ||
            `${event.city}, ${event.state}` ||
            event.address ||
            "TBD",
        status: event.status,
        attendees: confirmedRegistrations,
        registrations: confirmedRegistrations,
        revenue: totalRevenue,
        eventType: event.category || "Conference",
        maxAttendees: event.maxAttendees,
        isVirtual: event.isVirtual || false,
        bannerImage: event.bannerImage,
        thumbnailImage: event.thumbnailImage,
        isPublic: event.isPublic ?? true,
        tags: event.tags ?? [],
        exhibitionSpaces: event.exhibitionSpaces,
      }
    })

    return NextResponse.json({ events: transformedEvents })
  } catch (error) {
    console.error("Error fetching organizer events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ✅ POST Handler - Fixed version
export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid organizer ID" }, { status: 400 })
    }

    if (session.user?.id !== id && session.user?.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const newEvent = await prisma.event.create({
      data: {
        id: new ObjectId().toHexString(),
        title: body.title,
        description: body.description,
        shortDescription: body.shortDescription || null,
        slug: body.slug ?? body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        status: (body.status?.toUpperCase() as EventStatus) || EventStatus.DRAFT,
        category: body.category || null,
        tags: body.tags || [],
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        registrationStart: new Date(body.registrationStart || body.startDate),
        registrationEnd: new Date(body.registrationEnd || body.endDate),
        timezone: body.timezone || "UTC",
        isVirtual: body.isVirtual || false,
        virtualLink: body.virtualLink || null,
        address: body.address || null,
        location: body.location || null,
        city: body.city || null,
        state: body.state || null,
        country: body.country || null,
        zipCode: body.zipCode || null,
        venueId: ObjectId.isValid(body.venue) ? body.venue : null,
        maxAttendees: body.maxAttendees || null,
        currency: body.currency || "USD",
        bannerImage: body.bannerImage || null,
        thumbnailImage: body.thumbnailImage || null,
        isPublic: body.isPublic !== false,
        requiresApproval: body.requiresApproval || false,
        allowWaitlist: body.allowWaitlist || false,
        refundPolicy: body.refundPolicy || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        organizerId: id,

        // ✅ Fixed: Added required spaceType field
        exhibitionSpaces: body.exhibitionSpaces
          ? {
              create: body.exhibitionSpaces.map((space: any) => ({
                spaceType: space.spaceType || "CUSTOM", // Required field
                name: space.name,
                description: space.description,
                basePrice: space.basePrice,
                pricePerSqm: space.pricePerSqm,
                minArea: space.minArea,
                isFixed: space.isFixed ?? false,
                additionalPowerRate: space.additionalPowerRate,
                compressedAirRate: space.compressedAirRate,
                unit: space.unit,
                area: space.area || 0, // Also adding area field which is required
                isAvailable: space.isAvailable !== false,
                maxBooths: space.maxBooths || null,
              })),
            }
          : undefined,
      },
      include: {
        exhibitionSpaces: true,
      },
    })

    await prisma.user.update({
      where: { id },
      data: {
        totalEvents: { increment: 1 },
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