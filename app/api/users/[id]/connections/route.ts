import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = id

    // Users can only view their own connections unless they're admin
    if (session.user.id !== userId && session.user.role !== "admin" && session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // For hardcoded users, return mock connections
    const hardcodedConnections = [
      {
        id: "conn-1",
        firstName: "John",
        lastName: "Doe",
        jobTitle: "Software Engineer",
        company: "Tech Corp",
        avatar: null,
        mutualConnections: 5,
      },
      {
        id: "conn-2",
        firstName: "Jane",
        lastName: "Smith",
        jobTitle: "Product Manager",
        company: "Innovation Inc",
        avatar: null,
        mutualConnections: 3,
      },
      {
        id: "conn-3",
        firstName: "Mike",
        lastName: "Johnson",
        jobTitle: "UX Designer",
        company: "Creative Studio",
        avatar: null,
        mutualConnections: 8,
      },
      {
        id: "conn-4",
        firstName: "Sarah",
        lastName: "Wilson",
        jobTitle: "Marketing Director",
        company: "Growth Co",
        avatar: null,
        mutualConnections: 2,
      },
    ]

    if (["admin-1", "organizer-1", "superadmin-1"].includes(userId)) {
      return NextResponse.json({ connections: hardcodedConnections })
    }

    // For database users, implement actual connections logic
    // This would require a connections/followers table in your schema
    const connections = await prisma.user.findMany({
      where: {
        id: { not: userId },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        company: true,
        avatar: true,
      },
      take: 10, // Limit for demo
    })

    return NextResponse.json({ connections })
  } catch (error) {
    console.error("Error fetching connections:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
