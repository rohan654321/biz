import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exhibitorId = searchParams.get("exhibitorId") // ✅ new param

    if (!exhibitorId) {
      return NextResponse.json({ error: "exhibitorId is required" }, { status: 400 })
    }

    const booths = await prisma.exhibitorBooth.findMany({
      where: {
        exhibitorId, // filter by exhibitor
      },
      include: {
        event: true,
        exhibitor: true,
        
      },
      orderBy: { createdAt: "desc" },
    })

    // Map unique events
    const eventsMap = new Map<string, any>()
    booths.forEach((b) => {
      if (b.event?.id && !eventsMap.has(b.event.id)) {
        eventsMap.set(b.event.id, {
          id: b.event.id,
          title: b.event.title,
          startDate: b.event.startDate,
          endDate: b.event.endDate,
        //   location: b.event.venue || "N/A",
          status: b.event.status || "Scheduled",
        })
      }
    })

    return NextResponse.json({ events: Array.from(eventsMap.values()) }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

