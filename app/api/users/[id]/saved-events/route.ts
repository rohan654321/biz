import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const userId = resolvedParams.userId

    // Check permissions
    if (session.user.id !== userId && session.user.role !== "ATTENDEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch saved events
    const savedEvents = await prisma.savedEvent.findMany({
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
                company: true,
              },
            },
            venue: {
              select: {
                id: true,
                venueName: true,
                venueAddress: true,
                venueCity: true,
                venueState: true,
              },
            },
          },
        },
      },
      orderBy: { savedAt: "desc" }
    })

    const events = savedEvents.map((saved) => ({
      id: saved.event.id,
      title: saved.event.title,
      description: saved.event.description,
      shortDescription: saved.event.shortDescription,
      startDate: saved.event.startDate.toISOString(),
      endDate: saved.event.endDate.toISOString(),
      location: saved.event.location || saved.event.venue?.venueName || "TBA",
      city: saved.event.city || saved.event.venue?.venueCity,
      state: saved.event.state || saved.event.venue?.venueState,
      status: saved.event.status,
      type: saved.event.eventType?.[0] || "General",
      bannerImage: saved.event.bannerImage,
      thumbnailImage: saved.event.thumbnailImage,
      organizer: saved.event.organizer,
      savedAt: saved.savedAt.toISOString(),
    }))

    return NextResponse.json({ events })

  } catch (error) {
    console.error("Error fetching saved events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}