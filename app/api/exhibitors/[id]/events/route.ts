import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid exhibitor ID" }, { status: 400 })
    }

    // Mock events data
    const events = [
      {
        id: "event-1",
        title: "Tech Conference 2024",
        description: "Annual technology conference featuring the latest innovations",
        startDate: "2024-03-15T09:00:00Z",
        endDate: "2024-03-17T18:00:00Z",
        location: "San Francisco, CA",
        venue: "Moscone Convention Center",
        status: "PUBLISHED",
        registrationStatus: "CONFIRMED",
        boothNumber: "A-123",
        boothSize: "10x10",
        requirements: ["Power outlet", "WiFi", "Display screen"],
        attendeeCount: 2500,
        category: "Technology",
        image: "/tech-conference.png",
      },
      {
        id: "event-2",
        title: "Innovation Summit",
        description: "Summit focusing on breakthrough innovations and startups",
        startDate: "2024-04-20T10:00:00Z",
        endDate: "2024-04-22T17:00:00Z",
        location: "New York, NY",
        venue: "Jacob K. Javits Convention Center",
        status: "PUBLISHED",
        registrationStatus: "PENDING",
        boothNumber: "B-456",
        boothSize: "8x8",
        requirements: ["Power outlet", "Internet connection"],
        attendeeCount: 1800,
        category: "Innovation",
        image: "/innovation-summit.png",
      },
      {
        id: "event-3",
        title: "Digital Marketing Expo",
        description: "Comprehensive expo for digital marketing professionals",
        startDate: "2024-05-10T08:00:00Z",
        endDate: "2024-05-12T19:00:00Z",
        location: "Las Vegas, NV",
        venue: "Las Vegas Convention Center",
        status: "DRAFT",
        registrationStatus: "NOT_REGISTERED",
        boothNumber: null,
        boothSize: null,
        requirements: [],
        attendeeCount: 3200,
        category: "Marketing",
        image: "/digital-marketing-expo.png",
      },
    ]

    return NextResponse.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Error fetching exhibitor events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid exhibitor ID" }, { status: 400 })
    }

    // Mock event registration
    const registration = {
      id: `reg-${Date.now()}`,
      eventId: body.eventId,
      exhibitorId: id,
      boothNumber: body.boothNumber || `AUTO-${Math.floor(Math.random() * 1000)}`,
      boothSize: body.boothSize || "10x10",
      requirements: body.requirements || [],
      status: "PENDING",
      registeredAt: new Date().toISOString(),
      paymentStatus: "PENDING",
      totalCost: body.totalCost || 1500,
    }

    return NextResponse.json({
      success: true,
      registration,
      message: "Successfully registered for event",
    })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
