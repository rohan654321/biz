import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/exhibitors/[id] - Get exhibitor by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const exhibitor = await prisma.exhibitor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
            phone: true,
            website: true,
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

    if (!exhibitor) {
      return NextResponse.json({ error: "Exhibitor not found" }, { status: 404 })
    }

    return NextResponse.json(exhibitor)
  } catch (error) {
    console.error("Error fetching exhibitor:", error)
    return NextResponse.json({ error: "Failed to fetch exhibitor" }, { status: 500 })
  }
}

// PUT /api/exhibitors/[id] - Update exhibitor
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const exhibitor = await prisma.exhibitor.update({
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

    return NextResponse.json(exhibitor)
  } catch (error) {
    console.error("Error updating exhibitor:", error)
    return NextResponse.json({ error: "Failed to update exhibitor" }, { status: 500 })
  }
}

// DELETE /api/exhibitors/[id] - Delete exhibitor
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.exhibitor.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Exhibitor deleted successfully" })
  } catch (error) {
    console.error("Error deleting exhibitor:", error)
    return NextResponse.json({ error: "Failed to delete exhibitor" }, { status: 500 })
  }
}
