// app/api/speakers/[id]/events/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const events = await prisma.speakerSession.findMany({
      where: {
        speakerId: id,
      },
      include: {
        event: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    // Separate into upcoming and past events
    const now = new Date()
    const upcoming = events.filter(session => new Date(session.startTime) > now)
    const past = events.filter(session => new Date(session.startTime) <= now)

    return NextResponse.json({
      success: true,
      upcoming: upcoming.map(session => ({
        id: session.id,
        title: session.title,
        date: session.startTime, // Format this as needed
        location: session.room || "TBD",
        image: "/placeholder.svg", // You might want to store event images
      })),
      past: past.map(session => ({
        id: session.id,
        title: session.title,
        date: session.startTime, // Format this as needed
        location: session.room || "TBD",
        image: "/placeholder.svg", // You might want to store event images
      })),
    })
  } catch (error) {
    console.error("Error fetching speaker events:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}