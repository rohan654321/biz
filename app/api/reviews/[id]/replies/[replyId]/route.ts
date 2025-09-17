import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string; replyId: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is organizer of the event or the reply author
    const review = await prisma.review.findUnique({
      where: {
        id: params.reviewId
      },
      include: {
        event: {
          select: {
            organizerId: true
          }
        }
      }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const reply = await prisma.reviewReply.findUnique({
      where: {
        id: params.replyId
      }
    })

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    // Allow deletion if user is the organizer or the reply author
    if (review.event?.organizerId !== session.user.id && reply.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the reply
    await prisma.reviewReply.delete({
      where: {
        id: params.replyId
      }
    })

    return NextResponse.json({ message: 'Reply deleted successfully' })
  } catch (error) {
    console.error('Error deleting reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}