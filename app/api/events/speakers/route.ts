import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      eventId,
      speakerId,
      title,
      description,
      sessionType,
      duration,
      startTime,
      endTime,
      room,
      abstract,
      learningObjectives,
      targetAudience,
      materials,
    } = body

    // Validate required fields
    if (!eventId || !speakerId || !title || !sessionType || !duration) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if user is organizer of the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true },
    })

    if (!event || event.organizerId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized to modify this event" }, { status: 403 })
    }

    // Check if speaker exists
    const speaker = await prisma.user.findUnique({
      where: { id: speakerId, role: "SPEAKER" },
    })

    if (!speaker) {
      return NextResponse.json({ success: false, error: "Speaker not found" }, { status: 404 })
    }

    const speakerSession = await prisma.speakerSession.create({
      data: {
        eventId,
        speakerId,
        title,
        description,
        sessionType,
        duration: Number.parseInt(duration),
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : new Date(),
        room,
        abstract,
        learningObjectives: learningObjectives || [],
        targetAudience,
        materials: materials || [],
      },
      include: {
        speaker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            company: true,
            jobTitle: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      speakerSession,
      message: "Speaker added to event successfully",
    })
  } catch (error) {
    console.error("Error adding speaker to event:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
