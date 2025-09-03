import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
 try {
    const { id } =await params

    // Validate ObjectId
    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, error: "Invalid speaker ID" }, { status: 400 })
    }

    // Query database
    const exhibitor = await prisma.user.findFirst({
      where: {
        id: id,
        role: "SPEAKER",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        bio: true,
        website: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!exhibitor) {
      return NextResponse.json({ success: false, error: "Speaker not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      exhibitor,
    })
  } catch (error) {
    console.error("Error in exhibitor API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}