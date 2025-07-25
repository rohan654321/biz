import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/venues/[id] - Get venue by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            likes: true,
            reviews: true,
          },
        },
      },
    })

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    return NextResponse.json(venue)
  } catch (error) {
    console.error("Error fetching venue:", error)
    return NextResponse.json({ error: "Failed to fetch venue" }, { status: 500 })
  }
}

// PUT /api/venues/[id] - Update venue
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(venue)
  } catch (error) {
    console.error("Error updating venue:", error)
    return NextResponse.json({ error: "Failed to update venue" }, { status: 500 })
  }
}

// DELETE /api/venues/[id] - Delete venue
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.venue.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Venue deleted successfully" })
  } catch (error) {
    console.error("Error deleting venue:", error)
    return NextResponse.json({ error: "Failed to delete venue" }, { status: 500 })
  }
}
