import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: "Invalid venue ID" }, { status: 400 })
    }

    const events = await prisma.event.findMany({
      where: { venueId: id },
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error("Error fetching events by venue ID:", error)
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 })
  }
}