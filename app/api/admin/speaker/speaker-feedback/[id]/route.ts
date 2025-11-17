import { type NextRequest, NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        event: {
          select: {
            title: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching feedback details:", error)
    return NextResponse.json({ error: "Failed to fetch feedback details" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { action, reason } = body

    if (action === "approve") {
      const review = await prisma.review.update({
        where: { id },
        data: {
          isApproved: true,
        },
      })

      return NextResponse.json({
        message: "Feedback approved successfully",
        review,
      })
    } else if (action === "reject") {
      const review = await prisma.review.update({
        where: { id },
        data: {
          isApproved: false,
          isPublic: false,
        },
      })

      return NextResponse.json({
        message: "Feedback rejected successfully",
        review,
        reason,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating feedback:", error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}
