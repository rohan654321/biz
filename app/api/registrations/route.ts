import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/registrations?userId=xxx - Get user's event registrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const eventId = searchParams.get("eventId")
    const status = searchParams.get("status")

    const where: any = {}
    if (userId) where.userId = userId
    if (eventId) where.eventId = eventId
    if (status) where.status = status

    const registrations = await prisma.eventRegistration.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            images: true,
            timings: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}

// POST /api/registrations - Register for an event
export async function POST(request: NextRequest) {
  try {
    const { userId, eventId, registrationType, ticketType, paymentAmount, attendeeInfo } = await request.json()

    // Check if user already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 })
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        registrationType,
        ticketType,
        paymentAmount,
        attendeeInfo,
        qrCode: `QR-${Date.now()}-${userId}`, // Generate simple QR code
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            timings: true,
            location: true,
          },
        },
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("Error creating registration:", error)
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 })
  }
}
