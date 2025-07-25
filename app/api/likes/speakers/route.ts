import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/likes/speakers - Like/Unlike a speaker
export async function POST(request: NextRequest) {
  try {
    const { userId, speakerId } = await request.json()

    const existingLike = await prisma.speakerLike.findUnique({
      where: {
        userId_speakerId: {
          userId,
          speakerId,
        },
      },
    })

    if (existingLike) {
      await prisma.speakerLike.delete({
        where: {
          userId_speakerId: {
            userId,
            speakerId,
          },
        },
      })

      await prisma.speaker.update({
        where: { id: speakerId },
        data: {
          followers: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json({ liked: false, message: "Speaker unliked" })
    } else {
      await prisma.speakerLike.create({
        data: {
          userId,
          speakerId,
        },
      })

      await prisma.speaker.update({
        where: { id: speakerId },
        data: {
          followers: {
            increment: 1,
          },
        },
      })

      return NextResponse.json({ liked: true, message: "Speaker liked" })
    }
  } catch (error) {
    console.error("Error toggling speaker like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}

// GET /api/likes/speakers?userId=xxx - Get user's liked speakers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const likedSpeakers = await prisma.speakerLike.findMany({
      where: { userId },
      include: {
        speaker: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(likedSpeakers)
  } catch (error) {
    console.error("Error fetching liked speakers:", error)
    return NextResponse.json({ error: "Failed to fetch liked speakers" }, { status: 500 })
  }
}
