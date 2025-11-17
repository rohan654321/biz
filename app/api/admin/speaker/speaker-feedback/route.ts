import { type NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Fetch speaker feedback through speaker sessions
    // We'll get reviews for events that have speaker sessions
    const speakerSessions = await prisma.speakerSession.findMany({
      select: {
        speakerId: true,
        eventId: true,
        title: true,
        speaker: {
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
            reviews: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
                event: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Transform the data to create speaker feedback list
    const feedbackMap = new Map<string, any>()

    speakerSessions.forEach((session) => {
      session.event.reviews.forEach((review) => {
        const key = `${session.speakerId}-${review.id}`
        if (!feedbackMap.has(key)) {
          feedbackMap.set(key, {
            id: review.id,
            speakerId: session.speakerId,
            speakerName: `${session.speaker.firstName} ${session.speaker.lastName}`,
            speakerEmail: session.speaker.email,
            avatar: session.speaker.avatar,
            userName: `${review.user.firstName} ${review.user.lastName}`,
            userEmail: review.user.email,
            eventName: review.event?.title || null,
            sessionTitle: session.title,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            isApproved: review.isApproved,
            createdAt: review.createdAt,
          })
        }
      })
    })

    const feedback = Array.from(feedbackMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    // Calculate statistics
    const stats = {
      totalFeedback: feedback.length,
      pendingReviews: feedback.filter((f) => !f.isApproved).length,
      approvedFeedback: feedback.filter((f) => f.isApproved).length,
      averageRating: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0,
    }

    return NextResponse.json({
      feedback,
      stats,
    })
  } catch (error) {
    console.error("Error fetching speaker feedback:", error)
    return NextResponse.json({ error: "Failed to fetch speaker feedback" }, { status: 500 })
  }
}
