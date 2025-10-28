import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            organizationName: true,
            company:true,
            description: true,
            phone: true,
            totalEvents: true,
            averageRating: true,
            totalReviews: true,
            createdAt: true,
          },
        },
        venue: true,
        leads: true,
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: "asc" },
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
          orderBy: { startTime: "asc" },
        },
        exhibitionSpaces: { where: { isAvailable: true } },
        _count: { select: { registrations: true, reviews: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const availableTickets =
      event.ticketTypes?.reduce(
        (total: number, ticket: { quantity: number; sold: number }) => total + (ticket.quantity - ticket.sold),
        0,
      ) ?? 0

    const eventData = {
      ...event,
      availableTickets,
      isAvailable: availableTickets > 0 && new Date() < event.registrationEnd,
      registrationCount: event._count?.registrations ?? 0,
      reviewCount: event._count?.reviews ?? 0,
      // Include layoutPlan in the response
      layoutPlan: event.layoutPlan,
    }

    return NextResponse.json(eventData)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    const body = await request.json()

    // Only allow certain fields to be updated
    const allowedFields = ["title", "address", "startDate", "endDate", "description"]
    const dataToUpdate: any = {}
    allowedFields.forEach((key) => {
      if (body[key] !== undefined) {
        dataToUpdate[key] = key.includes("Date") ? new Date(body[key]) : body[key]
      }
    })

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: dataToUpdate,
    })

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { description, tags, images } = body

    console.log("[v0] Updating event:", id, "with images:", images?.length || 0)

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(description && { description }),
        ...(tags && { tags }),
        ...(images && { images }),
      },
    })

    console.log("[v0] Event updated successfully with", updatedEvent.images?.length || 0, "images")

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("[v0] Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}
