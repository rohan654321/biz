import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/events/exhibitors/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exhibitorId = params.id

    if (!exhibitorId) {
      return NextResponse.json(
        { success: false, message: "Exhibitor ID is required" },
        { status: 400 }
      )
    }

    // Fetch booths for this exhibitor with related event + organizer
    const booths = await prisma.exhibitorBooth.findMany({
      where: { exhibitorId },
      include: {
        event: {
          include: {
            organizer: true, // get organizer details
            venue: true, // get venue details if you have a Venue model
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: { events: booths.map((booth) => ({ booth, event: booth.event })) },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching exhibitor events:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch exhibitor events" },
      { status: 500 }
    )
  }
}
