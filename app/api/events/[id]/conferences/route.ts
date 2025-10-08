import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/events/[id]/conferences - Get all conferences for an event
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params

    const conferences = await prisma.conference.findMany({
      where: {
        eventId,
      },
      include: {
        sessions: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(conferences)
  } catch (error) {
    console.error("Error fetching conferences:", error)
    return NextResponse.json({ error: "Failed to fetch conferences" }, { status: 500 })
  }
}

// POST /api/events/[id]/conferences - Create a new conference
export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    
    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 })
    }

    const body = await request.json()
    const { date, day, theme, sessions } = body

    if (!date || !day || !theme || !sessions?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const conference = await prisma.conference.create({
      data: {
        eventId,
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
          orderBy: { order: "asc" } 
        } 
      },
    })

    return NextResponse.json(conference, { status: 201 })
  } catch (error) {
    console.error("Error creating conference:", error)
    return NextResponse.json({ error: "Failed to create conference" }, { status: 500 })
  }
}