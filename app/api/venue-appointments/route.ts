import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to schedule meetings." }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const {
      venueId,
      title,
      description,
      type = "VENUE_TOUR",
      requestedDate,
      requestedTime,
      duration = 30,
      meetingType = "IN_PERSON",
      purpose,
      requesterCompany,
      requesterTitle,
      requesterPhone,
      requesterEmail,
      eventType,
      expectedAttendees,
      eventDate,
      meetingSpacesInterested = [],
      location,
      agenda = [],
    } = body

    // Validate required fields
    if (!venueId || !title || !requestedDate || !requestedTime) {
      return NextResponse.json(
        { error: "Missing required fields: venueId, title, requestedDate, requestedTime" },
        { status: 400 },
      )
    }

    // Verify the venue exists and get the venue manager
    const venue = await prisma.user.findUnique({
      where: { id: venueId },
      select: { id: true, role: true },
    })

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    if (venue.role !== "VENUE_MANAGER") {
      return NextResponse.json({ error: "Invalid venue. User is not a venue manager." }, { status: 400 })
    }

    // Create the venue appointment
    const venueAppointment = await prisma.venueAppointment.create({
      data: {
        venueId,
        requesterId: session.user.id,
        title,
        description,
        type,
        status: "PENDING",
        priority: "MEDIUM",
        requestedDate: new Date(requestedDate),
        requestedTime,
        duration,
        meetingType,
        purpose,
        requesterCompany,
        requesterTitle,
        requesterPhone,
        requesterEmail,
        eventType,
        expectedAttendees,
        eventDate: eventDate ? new Date(eventDate) : null,
        meetingSpacesInterested,
        location,
        agenda,
        reminderSent: false,
        followUpRequired: true,
      },
      include: {
        venue: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Venue appointment created successfully",
        data: venueAppointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating venue appointment:", error)

    return NextResponse.json(
      {
        error: "Failed to create venue appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get("venueId")
    const requesterId = searchParams.get("requesterId")

    // Build the query filter
    const where: any = {}

    if (venueId) {
      where.venueId = venueId
    }

    if (requesterId) {
      where.requesterId = requesterId
    }

    // If no filters, return appointments for the current user
    if (!venueId && !requesterId) {
      where.OR = [{ venueId: session.user.id }, { requesterId: session.user.id }]
    }

    const appointments = await prisma.venueAppointment.findMany({
      where,
      include: {
        venue: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: appointments,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching venue appointments:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch venue appointments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
