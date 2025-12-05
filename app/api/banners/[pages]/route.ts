import { type NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { page: string } }) {
  try {
    const page = params.page

    console.log("[v0] Fetching banners for page:", page)

    // Fetch active banners for the specific page
    const banners = await prisma.banner.findMany({
      where: {
        page,
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    })

    console.log("[v0] Found banners:", banners.length)

    // Increment impressions for each banner
    if (banners.length > 0) {
      await Promise.all(
        banners.map((banner) =>
          prisma.banner.update({
            where: { id: banner.id },
            data: { impressions: { increment: 1 } },
          }),
        ),
      )
    }

    return NextResponse.json(banners)
  } catch (error) {
    console.error("[v0] Error fetching banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}
