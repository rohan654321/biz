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
    const { searchParams } = new URL(request.url)
    const includeReplies = searchParams.get('includeReplies') === 'true'

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all events for this organizer
    const organizerEvents = await prisma.event.findMany({
      where: {
        organizerId: params.id
      },
      select: {
        id: true
      }
    })

    const eventIds = organizerEvents.map(event => event.id)

    // Get all reviews for these events
    const reviews = await prisma.review.findMany({
      where: {
        eventId: {
          in: eventIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        event: {
          select: {
            id: true,
            title: true
          }
        },
        ...(includeReplies && {
          replies: {
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
              createdAt: 'asc'
            }
          }
        })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching organizer reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}