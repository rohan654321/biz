import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviews = await prisma.review.findMany({
      where: {
        eventId: params.id,
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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rating, title, comment } = await request.json()
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
        eventId: params.id,
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
        eventId: params.id,
        userId: userId,
        isPublic: true
      }
    })

    // Update event's average rating and total reviews
    const eventReviews = await prisma.review.findMany({
      where: { eventId: params.id }
    })

    const totalRating = eventReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / eventReviews.length

    await prisma.event.update({
      where: { id: params.id },
      data: {
        // You might want to add these fields to your Event model
        // averageRating: averageRating,
        // totalReviews: eventReviews.length
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}