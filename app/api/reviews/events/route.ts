import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/reviews/events?eventId=xxx - Get event reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.eventReview.findMany({
        where: { eventId, isApproved: true },
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.eventReview.count({ where: { eventId, isApproved: true } }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching event reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST /api/reviews/events - Create event review
export async function POST(request: NextRequest) {
  try {
    const { userId, eventId, rating, title, comment, breakdown } = await request.json()

    // Check if user already reviewed this event
    const existingReview = await prisma.eventReview.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this event" }, { status: 400 })
    }

    const review = await prisma.eventReview.create({
      data: {
        userId,
        eventId,
        rating,
        title,
        comment,
        breakdown,
      },
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
    })

    // Update event rating
    const allReviews = await prisma.eventReview.findMany({
      where: { eventId, isApproved: true },
      select: { rating: true },
    })

    const averageRating = allReviews.reduce((sum:any, r:any) => sum + r.rating, 0) / allReviews.length

    await prisma.event.update({
      where: { id: eventId },
      data: {
        averageRating,
        totalRatings: allReviews.length,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating event review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
