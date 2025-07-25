import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/speakers/[id] - Get speaker by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            socialLinks: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            reviews: true,
          },
        },
      },
    })

    if (!speaker) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 })
    }

    return NextResponse.json(speaker)
  } catch (error) {
    console.error("Error fetching speaker:", error)
    return NextResponse.json({ error: "Failed to fetch speaker" }, { status: 500 })
  }
}

// PUT /api/speakers/[id] - Update speaker
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(speaker)
  } catch (error) {
    console.error("Error updating speaker:", error)
    return NextResponse.json({ error: "Failed to update speaker" }, { status: 500 })
  }
}

// DELETE /api/speakers/[id] - Delete speaker
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.speaker.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Speaker deleted successfully" })
  } catch (error) {
    console.error("Error deleting speaker:", error)
    return NextResponse.json({ error: "Failed to delete speaker" }, { status: 500 })
  }
}
