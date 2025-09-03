import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const skip = (page - 1) * limit

    // For hardcoded users, return mock data
    if (["admin-1", "organizer-1", "superadmin-1"].includes(session.user.id)) {
      const mockNotifications = [
        {
          id: 1,
          type: "booking",
          title: "New Booking Request",
          message: "Digital Marketing Summit 2025 has requested Grand Ballroom for May 15-16",
          timestamp: "2025-01-22 3:00 PM",
          read: false,
          priority: "high",
        },
        {
          id: 2,
          type: "payment",
          title: "Payment Received",
          message: "Healthcare Innovation Summit has completed their advance payment",
          timestamp: "2025-01-22 1:30 PM",
          read: false,
          priority: "normal",
        },
        {
          id: 3,
          type: "reminder",
          title: "Setup Reminder",
          message: "Global Tech Conference setup starts tomorrow at 6:00 PM",
          timestamp: "2025-01-22 9:00 AM",
          read: true,
          priority: "medium",
        },
        {
          id: 4,
          type: "inquiry",
          title: "General Inquiry",
          message: "New inquiry about venue availability for corporate events",
          timestamp: "2025-01-21 5:45 PM",
          read: true,
          priority: "low",
        },
      ]

      const filteredNotifications = unreadOnly ? mockNotifications.filter((n) => !n.read) : mockNotifications

      return NextResponse.json({
        success: true,
        notifications: filteredNotifications,
        unreadCount: mockNotifications.filter((n) => !n.read).length,
      })
    }

    const where: any = {
      userId: session.user.id,
    }

    if (unreadOnly) {
      where.isRead = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ])

    const formattedNotifications = notifications.map((notif) => ({
      id: notif.id,
      type: notif.type.toLowerCase(),
      title: notif.title,
      message: notif.message,
      timestamp: notif.createdAt.toLocaleString(),
      read: notif.isRead,
      priority: notif.priority.toLowerCase(),
    }))

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAsRead } = body

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
      data: {
        isRead: markAsRead,
        readAt: markAsRead ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Notifications updated successfully",
    })
  } catch (error) {
    console.error("Update notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
