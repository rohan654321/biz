import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    const event = await prisma.event.findUnique({
      where: { id },
      select: { brochure: true },
    })

    if (!event?.brochure) {
      return NextResponse.json({ error: "Brochure not found" }, { status: 404 })
    }

    console.log("[v0] Fetching PDF from:", event.brochure)

    const response = await fetch(event.brochure)

    if (!response.ok) {
      console.error("[v0] Cloudinary response status:", response.status, response.statusText)
      return NextResponse.json({ error: `Failed to fetch PDF: ${response.status}` }, { status: response.status })
    }

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": action === "download" ? 'attachment; filename="brochure.pdf"' : "inline",
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching brochure:", error)
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
      select: { brochure: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    await prisma.event.update({
      where: { id },
      data: { brochure: null },
    })

    return NextResponse.json({ message: "Brochure removed successfully" })
  } catch (error) {
    console.error("[v0] Error deleting brochure:", error)
    return NextResponse.json({ error: "Failed to delete brochure" }, { status: 500 })
  }
}
