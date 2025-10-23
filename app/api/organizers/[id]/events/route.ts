import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { PrismaClient } from "@prisma/client"
import { EventStatus } from "@prisma/client"
import { ObjectId } from "mongodb"

const prisma = new PrismaClient()



// ✅ GET Handler
// ✅ GET Handler - Updated to include lead counts
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

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
            venueAddress: true,
            venueCity: true,
            venueState: true,
            venueCountry: true,
          },
        },
        exhibitionSpaces: true,
        ticketTypes: true,
        _count: {
          select: {
            registrations: {
              where: { status: "CONFIRMED" },
            },
            leads: true, // Add leads count
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
        leads: { // Include leads data
          select: {
            id: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const transformedEvents = events.map((event) => {
      const confirmedRegistrations = event._count.registrations
      const totalLeads = event._count.leads // Get total leads count
      const totalRevenue = event.registrations.reduce((sum, reg) => {
        if (reg.payment?.status === "COMPLETED") {
          return sum + (reg.payment.amount || 0)
        }
        return sum + reg.totalAmount
      }, 0)

      // Count leads by type
      const leadCounts = {
        ATTENDEE: event.leads.filter(lead => lead.type === 'ATTENDEE').length,
        EXHIBITOR: event.leads.filter(lead => lead.type === 'EXHIBITOR').length,
        SPEAKER: event.leads.filter(lead => lead.type === 'SPEAKER').length,
        SPONSOR: event.leads.filter(lead => lead.type === 'SPONSOR').length,
        PARTNER: event.leads.filter(lead => lead.type === 'PARTNER').length,
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description || "",
        shortDescription: event.shortDescription || "",
        slug: event.slug,
        date: event.startDate.toISOString().split("T")[0],
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        registrationStart: event.registrationStart.toISOString(),
        registrationEnd: event.registrationEnd.toISOString(),
        timezone: event.timezone,
        location: event.isVirtual
          ? "Virtual Event"
          : event.venue
            ? `${event.venue.firstName} ${event.venue.lastName ?? ""}`.trim()
            : "TBD",
        venueAddress: event.venue?.venueAddress || "",
        city: event.venue?.venueCity || "",
        venueState: event.venue?.venueState || "",
        venueCountry: event.venue?.venueCountry || "",
        status: event.status,
        category: event.category || "",
        edition: event.edition || "",
        tags: event.tags ?? [],
        eventType: event.eventType ?? [],
        isFeatured: event.isFeatured || false,
        isVIP: event.isVIP || false,
        attendees: confirmedRegistrations,
        registrations: confirmedRegistrations,
        leads: totalLeads, // Add total leads count
        leadCounts: leadCounts, // Add breakdown by type
        revenue: totalRevenue,
        maxAttendees: event.maxAttendees,
        currentAttendees: event.currentAttendees,
        currency: event.currency,
        isVirtual: event.isVirtual || false,
        virtualLink: event.virtualLink || "",
        images: event.images ?? [],
        videos: event.videos ?? [],
        documents: event.documents ?? [],
        brochure: event.brochure || "",
        layoutPlan: event.layoutPlan || "",
        bannerImage: event.bannerImage || "",
        thumbnailImage: event.thumbnailImage || "",
        isPublic: event.isPublic ?? true,
        requiresApproval: event.requiresApproval || false,
        allowWaitlist: event.allowWaitlist || false,
        refundPolicy: event.refundPolicy || "",
        metaTitle: event.metaTitle || "",
        metaDescription: event.metaDescription || "",
        exhibitionSpaces: event.exhibitionSpaces,
        ticketTypes: event.ticketTypes,
        averageRating: event.averageRating,
        totalReviews: event.totalReviews,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      }
    })

    return NextResponse.json({ events: transformedEvents })
  } catch (error) {
    console.error("Error fetching organizer events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


// ✅ POST Handler
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } =await params

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

    const images = Array.isArray(body.images) ? body.images : []
    const videos = Array.isArray(body.videos) ? body.videos : []
    const documents = Array.isArray(body.documents)
      ? body.documents.filter(Boolean)
      : [body.brochure, body.layoutPlan].filter(Boolean)

    const newEvent = await prisma.event.create({
      data: {
        id: new ObjectId().toHexString(),
        title: body.title,
        description: body.description,
        edition: body.edition ? String(body.edition) : null,
        shortDescription: body.shortDescription || null,
        slug:
          body.slug ??
          body.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        status: (body.status?.toUpperCase() as EventStatus) || EventStatus.DRAFT,
        category: body.category || null,
        tags: body.tags || [],
        eventType: body.eventType || [],
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        registrationStart: new Date(body.registrationStart || body.startDate),
        registrationEnd: new Date(body.registrationEnd || body.endDate),
        timezone: body.timezone || "UTC",
        isVirtual: body.isVirtual || false,
        virtualLink: body.virtualLink || null,
        venueId: ObjectId.isValid(body.venue) ? body.venue : null,
        maxAttendees: body.maxAttendees || null,
        currency: body.currency || "USD",
        images: images,
        videos: videos,
        documents: documents,
        brochure: body.brochure,
        layoutPlan: body.layoutPlan,
        bannerImage: body.bannerImage || images[0] || null,
        thumbnailImage: body.thumbnailImage || images[0] || null,
        isPublic: body.isPublic !== false,
        requiresApproval: body.requiresApproval || false,
        allowWaitlist: body.allowWaitlist || false,
        refundPolicy: body.refundPolicy || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        isFeatured: body.featured || false,
        isVIP: body.vip || false,
        organizerId: id,

        ticketTypes: body.ticketTypes
          ? {
              create: body.ticketTypes.map((ticket: any) => ({
                name: ticket.name,
                description: ticket.description,
                price: ticket.price,
                earlyBirdPrice: ticket.earlyBirdPrice || null,
                earlyBirdEnd: ticket.earlyBirdEnd ? new Date(ticket.earlyBirdEnd) : null,
                quantity: ticket.quantity,
                isActive: ticket.isActive !== false,
              })),
            }
          : undefined,

        exhibitionSpaces: body.exhibitionSpaces
          ? {
              create: body.exhibitionSpaces.map((space: any) => ({
                spaceType: space.spaceType || "CUSTOM",
                name: space.name,
                description: space.description,
                basePrice: space.basePrice,
                pricePerSqm: space.pricePerSqm,
                minArea: space.minArea,
                isFixed: space.isFixed ?? false,
                additionalPowerRate: space.additionalPowerRate,
                compressedAirRate: space.compressedAirRate,
                unit: space.unit,
                area: space.area || 0,
                isAvailable: space.isAvailable !== false,
                maxBooths: space.maxBooths || null,
              })),
            }
          : undefined,
      },
      include: {
        exhibitionSpaces: true,
        ticketTypes: true,
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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// ✅ PUT Handler - Update existing event
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { eventId, ...updateData } = body

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizerId: id,
      },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 404 })
    }

    const images = Array.isArray(updateData.images) ? updateData.images : existingEvent.images
    const videos = Array.isArray(updateData.videos) ? updateData.videos : existingEvent.videos
    const documents = Array.isArray(updateData.documents)
      ? updateData.documents.filter(Boolean)
      : [updateData.brochure, updateData.layoutPlan].filter(Boolean)

    const eventUpdateData: any = {
      title: updateData.title,
      description: updateData.description,
      shortDescription: updateData.shortDescription || null,
      slug:
        updateData.slug ??
        updateData.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      status: (updateData.status?.toUpperCase() as EventStatus) || existingEvent.status,
      category: updateData.category || null,
      tags: updateData.tags || [],
      eventType: updateData.eventType || existingEvent.eventType,
      startDate: updateData.startDate ? new Date(updateData.startDate) : existingEvent.startDate,
      endDate: updateData.endDate ? new Date(updateData.endDate) : existingEvent.endDate,
      registrationStart: updateData.registrationStart
        ? new Date(updateData.registrationStart)
        : existingEvent.registrationStart,
      registrationEnd: updateData.registrationEnd
        ? new Date(updateData.registrationEnd)
        : existingEvent.registrationEnd,
      timezone: updateData.timezone || existingEvent.timezone,
      isVirtual: updateData.isVirtual ?? existingEvent.isVirtual,
      virtualLink: updateData.virtualLink || null,
      venueId: updateData.venue && ObjectId.isValid(updateData.venue) ? updateData.venue : null,
      maxAttendees: updateData.maxAttendees || null,
      currency: updateData.currency || existingEvent.currency,
      images: images,
      videos: videos,
      documents: documents.length > 0 ? documents : existingEvent.documents,
      bannerImage: updateData.bannerImage || images[0] || null,
      thumbnailImage: updateData.thumbnailImage || images[0] || null,
      isPublic: updateData.isPublic !== false,
      requiresApproval: updateData.requiresApproval || false,
      allowWaitlist: updateData.allowWaitlist || false,
      refundPolicy: updateData.refundPolicy || null,
      metaTitle: updateData.metaTitle || null,
      metaDescription: updateData.metaDescription || null,
      isFeatured: updateData.featured || false,
      isVIP: updateData.vip || false,
    }

    if (updateData.ticketTypes) {
      await prisma.ticketType.deleteMany({
        where: { eventId: eventId },
      })

      eventUpdateData.ticketTypes = {
        create: updateData.ticketTypes.map((ticket: any) => ({
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          earlyBirdPrice: ticket.earlyBirdPrice || null,
          earlyBirdEnd: ticket.earlyBirdEnd ? new Date(ticket.earlyBirdEnd) : null,
          quantity: ticket.quantity,
          isActive: ticket.isActive !== false,
        })),
      }
    }

    if (updateData.exhibitionSpaces) {
      await prisma.exhibitionSpace.deleteMany({
        where: { eventId: eventId },
      })

      eventUpdateData.exhibitionSpaces = {
        create: updateData.exhibitionSpaces.map((space: any) => ({
          spaceType: space.spaceType || "CUSTOM",
          name: space.name,
          description: space.description,
          basePrice: space.basePrice,
          pricePerSqm: space.pricePerSqm,
          minArea: space.minArea,
          isFixed: space.isFixed ?? false,
          additionalPowerRate: space.additionalPowerRate,
          compressedAirRate: space.compressedAirRate,
          unit: space.unit,
          area: space.area || 0,
          isAvailable: space.isAvailable !== false,
          maxBooths: space.maxBooths || null,
        })),
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: eventUpdateData,
      include: {
        exhibitionSpaces: true,
        ticketTypes: true,
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
      },
    })

    return NextResponse.json(
      {
        message: "Event updated successfully",
        event: updatedEvent,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
