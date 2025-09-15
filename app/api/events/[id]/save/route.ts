import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const eventId = resolvedParams.id

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if already saved
    const existingSave = await prisma.savedEvent.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    })

    if (existingSave) {
      return NextResponse.json({ 
        message: "Event already saved", 
        saved: true 
      })
    }

    // Save the event
    const savedEvent = await prisma.savedEvent.create({
      data: {
        userId: session.user.id,
        eventId: eventId
      },
      include: {
        event: true
      }
    })

    return NextResponse.json({ 
      message: "Event saved successfully", 
      savedEvent 
    })

  } catch (error) {
    console.error("Error saving event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const eventId = resolvedParams.id

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove saved event
    await prisma.savedEvent.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    })

    return NextResponse.json({ 
      message: "Event removed from saved" 
    })

  } catch (error) {
    console.error("Error removing saved event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const eventId = resolvedParams.id

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if event is saved
    const savedEvent = await prisma.savedEvent.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    })

    return NextResponse.json({ 
      isSaved: !!savedEvent 
    })

  } catch (error) {
    console.error("Error checking saved event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}