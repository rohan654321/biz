import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch single push notification
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const notification = await prisma.pushNotification.findUnique({
      where: { id },
      include: {
        recipients: {
          take: 100, // Limit recipients for performance
          orderBy: { sentAt: "desc" },
        },
      },
    })

    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    // Format response
    const formattedNotification = {
      id: notification.id,
      title: notification.title,
      body: notification.message,
      imageUrl: notification.imageUrl,
      actionUrl: notification.actionUrl,
      status: notification.status,
      priority: notification.priority,
      targetAudiences: notification.targetAudiences,
      targetPlatforms: notification.targetPlatforms,
      scheduledAt: notification.scheduledAt?.toISOString(),
      sentAt: notification.sentAt?.toISOString(),
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
      stats: {
        totalRecipients: notification.totalRecipients,
        sent: notification.sent,
        delivered: notification.delivered,
        opened: notification.opened,
        clicked: notification.clicked,
        failed: notification.failed,
      },
      engagement: {
        openRate: notification.openRate,
        clickRate: notification.clickRate,
        deliveryRate: notification.deliveryRate,
        failureRate: notification.failureRate,
      },
      recipients: notification.recipients.map((r) => ({
        id: r.id,
        deviceToken: r.deviceToken,
        platform: r.platform,
        userId: r.userId,
        status: r.status,
        sentAt: r.sentAt?.toISOString(),
        deliveredAt: r.deliveredAt?.toISOString(),
        openedAt: r.openedAt?.toISOString(),
        clickedAt: r.clickedAt?.toISOString(),
      })),
    }

    return NextResponse.json({ success: true, data: formattedNotification })
  } catch (error) {
    console.error("[v0] Error fetching push notification:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch push notification" }, { status: 500 })
  }
}

// PUT - Update push notification
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const updatedNotification = await prisma.pushNotification.update({
      where: { id },
      data: {
        title: body.title,
        message: body.bodyText || body.message,
        imageUrl: body.imageUrl,
        actionUrl: body.actionUrl,
        status: body.status,
        priority: body.priority,
        targetAudiences: body.targetAudiences,
        targetPlatforms: body.targetPlatforms,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedNotification,
      message: "Notification updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating push notification:", error)
    return NextResponse.json({ success: false, error: "Failed to update push notification" }, { status: 500 })
  }
}

// DELETE - Delete push notification
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await prisma.pushNotification.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting push notification:", error)
    return NextResponse.json({ success: false, error: "Failed to delete push notification" }, { status: 500 })
  }
}
