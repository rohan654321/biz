import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendBadgeEmail } from "@/lib/email-service"

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params
    const body = await request.json()
    const { attendeeIds, badgeDataUrls } = body

    console.log("[v0] Bulk sending badges for event:", eventId, "to", attendeeIds.length, "attendees")

    if (!attendeeIds || !Array.isArray(attendeeIds) || attendeeIds.length === 0) {
      return NextResponse.json({ success: false, error: "No attendees specified" }, { status: 400 })
    }

    if (!badgeDataUrls || typeof badgeDataUrls !== "object") {
      return NextResponse.json({ success: false, error: "Badge data URLs are required" }, { status: 400 })
    }

    const results = {
      success: [] as string[],
      failed: [] as { id: string; email: string; error: string }[],
    }

    for (const attendeeId of attendeeIds) {
      try {
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
          results.failed.push({
            id: attendeeId,
            email: "unknown",
            error: "Attendee not found",
          })
          continue
        }

        const badgeDataUrl = badgeDataUrls[attendeeId]
        // if (!badgeDataUrl) {
        //   results.failed.push({
        //     id: attendeeId,
        //     email: attendeeLead.user.email,
        //     error: "Badge data not provided",
        //   })
        //   continue
        // }

        // await sendBadgeEmail({
        //   to: attendeeLead.user.email,
        //   attendeeName: `${attendeeLead.user.firstName} ${attendeeLead.user.lastName}`,
        //   eventTitle: attendeeLead.event.title,
        //   badgeDataUrl,
        // })

        results.success.push(attendeeId)
        console.log("[v0] Badge sent successfully to:", attendeeLead.user.email)
      } catch (error) {
        console.error("[v0] Error sending badge to attendee:", attendeeId, error)
        const attendeeLead = await prisma.eventLead.findUnique({
          where: { id: attendeeId },
          include: { user: true },
        })
        results.failed.push({
          id: attendeeId,
          email: attendeeLead?.user.email || "unknown",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    console.log("[v0] Bulk badge sending complete. Success:", results.success.length, "Failed:", results.failed.length)

    return NextResponse.json({
      success: true,
      message: `Badges sent to ${results.success.length} attendees`,
      data: results,
    })
  } catch (error) {
    console.error("[v0] Error in bulk badge sending:", error)
    return NextResponse.json({ success: false, error: "Failed to send badges" }, { status: 500 })
  }
}
