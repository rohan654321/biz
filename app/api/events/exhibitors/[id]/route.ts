import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface Params {
  id: string
}

// GET /api/events/exhibitors/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> } // 👈 make params a Promise
) {
  try {
    const { id: exhibitorId } = await context.params // 👈 await here

    if (!exhibitorId) {
      return NextResponse.json(
        { success: false, message: "Exhibitor ID is required" },
        { status: 400 }
      )
    }

    const booths = await prisma.exhibitorBooth.findMany({
      where: { exhibitorId },
      include: {
        event: {
          include: {
            organizer: true,
            venue: true,
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
