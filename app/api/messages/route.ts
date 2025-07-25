import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/messages?userId=xxx - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get latest message for each conversation
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Group by conversation partner
    const conversationMap = new Map()
    conversations.forEach((message:any) => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner: message.senderId === userId ? message.receiver : message.sender,
          lastMessage: message,
          unreadCount: 0,
        })
      }

      // Count unread messages
      if (message.receiverId === userId && !message.isRead) {
        conversationMap.get(partnerId).unreadCount++
      }
    })

    return NextResponse.json(Array.from(conversationMap.values()))
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, content, messageType = "TEXT", attachments } = await request.json()

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        messageType,
        attachments,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
