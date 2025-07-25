import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/likes/events - Like/Unlike an event
export async function POST(request: NextRequest) {
  try {
    const { userId, eventId } = await request.json()

    // Check if like already exists
    const existingLike = await prisma.eventLike.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (existingLike) {
      // Unlike - remove the like
      await prisma.eventLike.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      })

      // Update event followers count
      await prisma.event.update({
        where: { id: eventId },
        data: {
          followers: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json({ liked: false, message: "Event unliked" })
    } else {
      // Like - create new like
      await prisma.eventLike.create({
        data: {
          userId,
          eventId,
        },
      })

      // Update event followers count
      await prisma.event.update({
        where: { id: eventId },
        data: {
          followers: {
            increment: 1,
          },
        },
      })

      return NextResponse.json({ liked: true, message: "Event liked" })
    }
  } catch (error) {
    console.error("Error toggling event like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}

// GET /api/likes/events?userId=xxx - Get user's liked events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const likedEvents = await prisma.eventLike.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(likedEvents)
  } catch (error) {
    console.error("Error fetching liked events:", error)
    return NextResponse.json({ error: "Failed to fetch liked events" }, { status: 500 })
  }
}
