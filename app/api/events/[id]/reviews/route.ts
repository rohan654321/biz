import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// ✅ Correct: params is not a Promise
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const { searchParams } = new URL(request.url)
    const includeReplies = searchParams.get("includeReplies") === "true"

    console.log("[v0] Fetching reviews for event ID:", eventId)

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, averageRating: true, totalReviews: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const reviews = await prisma.review.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        ...(includeReplies && {
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        }),
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      event: {
        ...event,
        averageRating: event?.averageRating ?? 0,
        totalReviews: event?.totalReviews ?? 0,
      },
      reviews,
    })
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// ✅ Correct: params is a plain object
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { rating, title, comment } = await request.json()
    const userId = session.user.id
    const eventId = params.id

    console.log("📩 Received review for event:", eventId)

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const existingReview = await prisma.review.findFirst({
      where: { eventId, userId },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this event" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        rating: Number.parseInt(rating),
        title: title || "",
        comment: comment || "",
        eventId,
        userId,
        isPublic: true,
      },
    })

    // ✅ Recalculate event rating
    const eventReviews = await prisma.review.findMany({
      where: { eventId },
      select: { rating: true },
    })

    const totalRating = eventReviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / eventReviews.length

    console.log("⭐ Updating event rating:", averageRating, "Reviews:", eventReviews.length)

    await prisma.event.update({
      where: { id: eventId },
      data: {
        averageRating,
        totalReviews: eventReviews.length,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
