import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

// POST: Create a new review
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    // Await params before using
    const params = await context.params;
    const exhibitorId = params.id;

    if (!exhibitorId) {
      return NextResponse.json({ error: 'Invalid exhibitor ID' }, { status: 400 });
    }

    const body = await request.json();
    const { rating, title, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const exhibitor = await prisma.user.findFirst({
      where: { id: exhibitorId, role: 'EXHIBITOR' }
    });

    if (!exhibitor) {
      return NextResponse.json({ error: 'Exhibitor not found' }, { status: 404 });
    }

    // ✅ Allow multiple reviews per user
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        exhibitorId: exhibitorId, // Storing exhibitor as venueId
        rating: parseInt(rating),
        title: title || '',
        comment,
        isApproved: true,
        isPublic: true,
        replies: { create: [] }
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } }
      }
    });

    // Update exhibitor's average rating and total reviews
    const allReviews = await prisma.review.findMany({
      where: { exhibitorId: exhibitorId, isApproved: true, isPublic: true }
    });

    const totalReviews = allReviews.length;
    const averageRating =
      totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    await prisma.user.update({
      where: { id: exhibitorId },
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews
      }
    });

    return NextResponse.json(
      {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
        user: review.user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating exhibitor review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch reviews for an exhibitor
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const exhibitorId = params.id;

    if (!exhibitorId) {
      return NextResponse.json({ error: 'Invalid exhibitor ID' }, { status: 400 });
    }

    const exhibitor = await prisma.user.findFirst({
      where: { id: exhibitorId, role: 'EXHIBITOR' }
    });

    if (!exhibitor) {
      return NextResponse.json({ error: 'Exhibitor not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where: { exhibitorId: exhibitorId, isApproved: true, isPublic: true },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        replies: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalReviews = await prisma.review.count({
      where: { exhibitorId: exhibitorId, isApproved: true, isPublic: true }
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        user: r.user,
        replies: r.replies.map((rep) => ({
          id: rep.id,
          content: rep.content,
          createdAt: rep.createdAt.toISOString(),
          isOrganizerReply: rep.isOrganizerReply,
          user: rep.user
        }))
      })),
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching exhibitor reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}