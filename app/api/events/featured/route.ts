import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        title: true,
        startDate: true,
        bannerImage: true,
        images: true,
        // city: true,
        // location: true,
        // address: true,
        category: true,
      },
      orderBy: { startDate: "asc" },
    })

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch featured events:", error)
    return NextResponse.json({ error: "Failed to fetch featured events" }, { status: 500 })
  }
}
