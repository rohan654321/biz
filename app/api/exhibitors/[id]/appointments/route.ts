import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {id : exhibitorId} =await params

    if (!exhibitorId) {
      return NextResponse.json({ error: "Exhibitor ID is required" }, { status: 400 })
    }

    try {
      const appointments = await prisma.appointment.findMany({
        where: { exhibitorId },
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              company: true,
              jobTitle: true,
              avatar: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      // Transform to match expected format
      const formattedAppointments = appointments.map((appointment: any) => ({
        id: appointment.id,
        visitorName: appointment.requester
          ? `${appointment.requester.firstName || ""} ${appointment.requester.lastName || ""}`.trim()
          : "Unknown Visitor",
        visitorEmail: appointment.requester?.email || appointment.requesterEmail || "",
        visitorPhone: appointment.requester?.phone || appointment.requesterPhone || "",
        company: appointment.requester?.company || appointment.requesterCompany || "Unknown",
        designation: appointment.requester?.jobTitle || appointment.requesterTitle || "Unknown",
        requestedDate: appointment.requestedDate
          ? new Date(appointment.requestedDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        requestedTime: appointment.requestedTime || "09:00",
        duration: `${appointment.duration || 60} minutes`,
        purpose: appointment.purpose || appointment.description || "General meeting",
        status: appointment.status || "PENDING",
        priority: appointment.priority || "MEDIUM",
        profileViews: Math.floor(Math.random() * 50) + 1, // Mock data for now
        previousMeetings: Math.floor(Math.random() * 5), // Mock data for now
        notes: appointment.notes || "",
        meetingLink: appointment.meetingLink || "",
        location: appointment.location || "",
      }))

      return NextResponse.json({
        success: true,
        appointments: formattedAppointments,
        total: formattedAppointments.length,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          error: "Failed to fetch appointments",
          appointments: [],
          total: 0,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        appointments: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {id : exhibitorId} =await params
    const body = await request.json()

    const {
      eventId,
      requesterId,
      title,
      description,
      type = "CONSULTATION",
      requestedDate,
      requestedTime,
      duration = 60,
      meetingType = "IN_PERSON",
      location,
      purpose,
      agenda = [],
      notes = "",
      priority = "MEDIUM",
    } = body

    // Validate required fields
    if (!eventId || !requesterId || !title || !requestedDate || !requestedTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      // Get requester details for metadata
      const requester = await prisma.user.findUnique({
        where: { id: requesterId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          company: true,
          jobTitle: true,
        },
      })

      if (!requester) {
        return NextResponse.json({ error: "Requester not found" }, { status: 404 })
      }

      const appointment = await prisma.appointment.create({
        data: {
          eventId,
          exhibitorId,
          requesterId,
          title,
          description,
          type,
          requestedDate: new Date(requestedDate),
          requestedTime,
          duration: Number(duration),
          meetingType,
          location,
          purpose,
          agenda,
          notes,
          priority,
          // Store requester metadata
          requesterCompany: requester.company,
          requesterTitle: requester.jobTitle,
          requesterPhone: requester.phone,
          requesterEmail: requester.email,
        },
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true,
              avatar: true,
            },
          },
          exhibitor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true,
              avatar: true,
            },
          },
        },
      })

      // Create notification for exhibitor
      try {
        await prisma.notification.create({
          data: {
            userId: exhibitorId,
            type: "APPOINTMENT_REQUEST",
            title: "New Meeting Request",
            message: `${requester.firstName} ${requester.lastName} has requested a meeting: ${title}`,
            metadata: {
              appointmentId: appointment.id,
              eventId,
              requesterId,
            },
          },
        })
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification fails
      }

      return NextResponse.json({
        success: true,
        appointment,
        message: "Appointment request sent successfully!",
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {id : exhibitorId} =await params
    const body = await request.json()
    const { appointmentId, status, notes, confirmedDate, confirmedTime, outcome, cancellationReason } = body

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (outcome) updateData.outcome = outcome
    if (cancellationReason) updateData.cancellationReason = cancellationReason
    if (confirmedDate) updateData.confirmedDate = new Date(confirmedDate)
    if (confirmedTime) updateData.confirmedTime = confirmedTime

    // Handle status-specific updates
    if (status === "CANCELLED") {
      updateData.cancelledBy = session.user.id
      updateData.cancelledAt = new Date()
    }

    try {
      const appointment = await prisma.appointment.update({
        where: {
          id: appointmentId,
          exhibitorId: exhibitorId, // Ensure the appointment belongs to this exhibitor
        },
        data: updateData,
        include: {
          requester: true,
          exhibitor: true,
        },
      })

      // Create notifications based on status change
      try {
        if (status === "CONFIRMED") {
          await prisma.notification.create({
            data: {
              userId: appointment.requesterId,
              type: "APPOINTMENT_CONFIRMED",
              title: "Meeting Confirmed",
              message: `Your meeting "${appointment.title}" has been confirmed`,
              metadata: { appointmentId: appointment.id },
            },
          })
        } else if (status === "CANCELLED") {
          const notificationUserId =
            session.user.id === appointment.requesterId ? appointment.exhibitorId : appointment.requesterId

          await prisma.notification.create({
            data: {
              userId: notificationUserId,
              type: "APPOINTMENT_CANCELLED",
              title: "Meeting Cancelled",
              message: `The meeting "${appointment.title}" has been cancelled`,
              metadata: { appointmentId: appointment.id },
            },
          })
        }
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification fails
      }

      return NextResponse.json({
        success: true,
        appointment,
        message: "Appointment updated successfully!",
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
