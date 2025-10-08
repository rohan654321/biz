import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/events/[eventId]/conferences/[conferenceId] - Get a specific conference
export async function GET(request: NextRequest, { params }: { params: { eventId: string; conferenceId: string } }) {
  try {
    const { conferenceId } = params

    const conference = await prisma.conference.findUnique({
      where: {
        id: conferenceId,
      },
      include: {
        sessions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    if (!conference) {
      return NextResponse.json({ error: "Conference not found" }, { status: 404 })
    }

    return NextResponse.json(conference)
  } catch (error) {
    console.error("Error fetching conference:", error)
    return NextResponse.json({ error: "Failed to fetch conference" }, { status: 500 })
  }
}

// PUT /api/events/[eventId]/conferences/[conferenceId] - Update a conference
export async function PUT(request: NextRequest, { params }: { params: { eventId: string; conferenceId: string } }) {
  try {
    const { conferenceId } = params
    const body = await request.json()
    const { date, day, theme, sessions } = body

    // Verify conference exists
    const existingConference = await prisma.conference.findUnique({
      where: { id: conferenceId },
    })

    if (!existingConference) {
      return NextResponse.json({ error: "Conference not found" }, { status: 404 })
    }

    // Delete existing sessions and create new ones
    await prisma.conferenceSession.deleteMany({
      where: { conferenceId },
    })

    const conference = await prisma.conference.update({
      where: { id: conferenceId },
      data: {
        date,
        day,
        theme,
        sessions: {
          create: sessions.map((session: any, index: number) => ({
            time: session.time,
            title: session.title,
            description: session.description,
            speaker: session.speaker,
            type: session.type.toUpperCase(),
            order: index,
          })),
        },
      },
      include: {
        sessions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    return NextResponse.json(conference)
  } catch (error) {
    console.error("Error updating conference:", error)
    return NextResponse.json({ error: "Failed to update conference" }, { status: 500 })
  }
}

// PATCH /api/events/[eventId]/conferences/[conferenceId] - Publish/unpublish a conference
export async function PATCH(request: NextRequest, { params }: { params: { eventId: string; conferenceId: string } }) {
  try {
    const { conferenceId } = params
    const body = await request.json()
    const { isPublished } = body

    const conference = await prisma.conference.update({
      where: { id: conferenceId },
      data: { isPublished },
      include: {
        sessions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    return NextResponse.json(conference)
  } catch (error) {
    console.error("Error updating conference status:", error)
    return NextResponse.json({ error: "Failed to update conference status" }, { status: 500 })
  }
}

// DELETE /api/events/[eventId]/conferences/[conferenceId] - Delete a conference
export async function DELETE(request: NextRequest, { params }: { params: { eventId: string; conferenceId: string } }) {
  try {
    const { conferenceId } = params

    await prisma.conference.delete({
      where: { id: conferenceId },
    })

    return NextResponse.json({ message: "Conference deleted successfully" })
  } catch (error) {
    console.error("Error deleting conference:", error)
    return NextResponse.json({ error: "Failed to delete conference" }, { status: 500 })
  }
}
