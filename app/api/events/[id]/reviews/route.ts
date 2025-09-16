import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.id
    const { rating, title, comment } = await req.json()
    const userId = session.user.id

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this event
    const existingReview = await prisma.review.findFirst({
      where: {
        eventId: eventId,
        userId: userId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this event' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        title: title || '',
        comment: comment || '',
        eventId: eventId,
        userId: userId,
        isPublic: true
      }
    })

    // Update event's average rating and total reviews
    const eventReviews = await prisma.review.findMany({
      where: { eventId: eventId }
    })

    const totalRating = eventReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / eventReviews.length

    // Update event if you've added the fields to your schema
    // await prisma.event.update({
    //   where: { id: eventId },
    //   data: {
    //     averageRating: averageRating,
    //     totalReviews: eventReviews.length
    //   }
    // })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    const reviews = await prisma.review.findMany({
      where: {
        eventId: eventId,
        isPublic: true
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}