import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendBadgeEmail } from "@/lib/email-service"

export async function POST(request: NextRequest, { params }: { params: { eventId: string; attendeeId: string } }) {
  try {
    const { eventId, attendeeId } = params
    const body = await request.json()
    const { badgeDataUrl, email } = body

    console.log("[v0] Generating badge for attendee:", attendeeId, "event:", eventId)

    // <CHANGE> Fetch attendee and event data from database
    const attendeeLead = await prisma.eventLead.findUnique({
      where: { id: attendeeId },
      include: {
        user: true,
        event: {
          include: {
            organizer: true,
          },
        },
      },
    })

    if (!attendeeLead) {
      return NextResponse.json({ success: false, error: "Attendee not found" }, { status: 404 })
    }

    // <CHANGE> Send badge via email
    try {
      await sendBadgeEmail({
        to: email,
        attendeeName: `${attendeeLead.user.firstName} ${attendeeLead.user.lastName}`,
        eventTitle: attendeeLead.event.title,
        badgeDataUrl,
      })

      console.log("[v0] Badge sent successfully to:", email)

      return NextResponse.json({
        success: true,
        message: "Badge generated and sent successfully",
        data: {
          attendee: {
            name: `${attendeeLead.user.firstName} ${attendeeLead.user.lastName}`,
            email: attendeeLead.user.email,
          },
          event: {
            title: attendeeLead.event.title,
          },
        },
      })
    } catch (emailError) {
      console.error("[v0] Error sending email:", emailError)
      return NextResponse.json(
        {
          success: false,
          error: "Badge generated but failed to send email. Please try again.",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[v0] Error generating badge:", error)
    return NextResponse.json({ success: false, error: "Failed to generate badge" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { eventId: string; attendeeId: string } }) {
  try {
    const { eventId, attendeeId } = params

    // <CHANGE> Fetch attendee data for badge download
    const attendeeLead = await prisma.eventLead.findUnique({
      where: { id: attendeeId },
      include: {
        user: true,
        event: {
          include: {
            organizer: true,
          },
        },
      },
    })

    if (!attendeeLead) {
      return NextResponse.json({ success: false, error: "Attendee not found" }, { status: 404 })
    }

    // <CHANGE> Return attendee data for client-side badge generation
    return NextResponse.json({
      success: true,
      data: {
        attendee: {
          id: attendeeLead.id,
          firstName: attendeeLead.user.firstName,
          lastName: attendeeLead.user.lastName,
          email: attendeeLead.user.email,
          jobTitle: attendeeLead.user.jobTitle,
          company: attendeeLead.user.company,
        },
        event: {
          id: attendeeLead.event.id,
          title: attendeeLead.event.title,
          images: attendeeLead.event.images,
        },
        organizer: {
          avatar: attendeeLead.event.organizer?.avatar,
          organizationName: attendeeLead.event.organizer?.company,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching badge data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch badge data" }, { status: 500 })
  }
}
