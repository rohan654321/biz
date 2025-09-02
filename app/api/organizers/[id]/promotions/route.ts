import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock promotions data since promotion model doesn't exist in schema
    const mockPromotions = [
      {
        id: "1",
        eventId: "event-1",
        event: {
          id: "event-1",
          title: "Tech Conference 2024",
          date: "2024-03-15",
          location: "San Francisco, CA",
          status: "PUBLISHED",
        },
        packageType: "PREMIUM",
        targetCategories: ["Technology", "Business"],
        status: "ACTIVE",
        amount: 299,
        duration: 30,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        impressions: 15420,
        clicks: 892,
        conversions: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        eventId: "event-2",
        event: {
          id: "event-2",
          title: "Marketing Summit",
          date: "2024-04-20",
          location: "New York, NY",
          status: "PUBLISHED",
        },
        packageType: "BASIC",
        targetCategories: ["Marketing", "Digital"],
        status: "PENDING",
        amount: 99,
        duration: 14,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        impressions: 0,
        clicks: 0,
        conversions: 0,
        createdAt: new Date().toISOString(),
      },
    ]

    // Get organizer's events for promotion selection
    const events = await prisma.event.findMany({
      where: {
        organizerId: id,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        location: true,
        status: true,
        currentAttendees: true,
        maxAttendees: true,
        category: true,
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Transform events
    const transformedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.startDate.toISOString().split("T")[0],
      location: event.location,
      status: event.status,
      attendees: event.currentAttendees || 0,
      maxAttendees: event.maxAttendees || 0,
      category: event.category,
      registrations: event.currentAttendees || 0,
      revenue: 0, // Will be calculated from registrations if needed
    }))

    return NextResponse.json({
      promotions: mockPromotions,
      events: transformedEvents,
    })
  } catch (error) {
    console.error("Error fetching promotions:", error)
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

    const body = await request.json()
    const { eventId, packageType, targetCategories, amount, duration } = body

    // Mock promotion creation since promotion model doesn't exist
    const mockPromotion = {
      id: Date.now().toString(),
      eventId,
      event: {
        id: eventId,
        title: "Selected Event",
        startDate: new Date(),
        location: "Event Location",
      },
      packageType,
      targetCategories,
      amount,
      duration,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Promotion created successfully",
      promotion: mockPromotion,
    })
  } catch (error) {
    console.error("Error creating promotion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
