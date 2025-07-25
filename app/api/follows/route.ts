import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/follows - Follow/Unfollow a user
export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json()

    if (followerId === followingId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      })

      return NextResponse.json({ following: false, message: "Unfollowed successfully" })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      })

      return NextResponse.json({ following: true, message: "Followed successfully" })
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 })
  }
}

// GET /api/follows?userId=xxx&type=followers|following - Get user's followers or following
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // "followers" or "following"

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    let follows
    if (type === "followers") {
      follows = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatar: true,
              bio: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      follows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatar: true,
              bio: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(follows)
  } catch (error) {
    console.error("Error fetching follows:", error)
    return NextResponse.json({ error: "Failed to fetch follows" }, { status: 500 })
  }
}
