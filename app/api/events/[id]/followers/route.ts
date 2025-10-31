import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
    }

    // Fetch saved events with user details
    const savedEvents = await prisma.savedEvent.findMany({
      where: {
        eventId: id
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            role: true,
            company: true,
            jobTitle: true,
          }
        }
      },
      orderBy: {
        savedAt: 'desc'
      }
    })

    return NextResponse.json({
      followers: savedEvents,
      total: savedEvents.length
    })

  } catch (error) {
    console.error("Error fetching event followers:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}