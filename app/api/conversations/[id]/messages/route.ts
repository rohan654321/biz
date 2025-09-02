import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversationId = id

    // Mock messages data for the conversation
    const mockMessages = [
      {
        id: "msg1",
        content: "Hey! How are you doing?",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        sender: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        isRead: true,
      },
      {
        id: "msg2",
        content: "I'm doing great! Thanks for asking. How about you?",
        createdAt: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
        sender: {
          id: session.user.id,
          firstName: session.user.firstName || "You",
          lastName: session.user.lastName || "",
          avatar: session.user.avatar,
        },
        isRead: true,
      },
      {
        id: "msg3",
        content: "I'm excited about the upcoming conference! Are you planning to attend?",
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        sender: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        isRead: true,
      },
      {
        id: "msg4",
        content: "I've already registered. Looking forward to the networking sessions.",
        createdAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        sender: {
          id: session.user.id,
          firstName: session.user.firstName || "You",
          lastName: session.user.lastName || "",
          avatar: session.user.avatar,
        },
        isRead: true,
      },
    ]

    return NextResponse.json({ messages: mockMessages })
  } catch (error) {
    console.error("Error fetching conversation messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, senderId } = await request.json()

    if (!content || !senderId) {
      return NextResponse.json({ error: "Content and senderId are required" }, { status: 400 })
    }

    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      sender: {
        id: senderId,
        firstName: session.user.firstName || "You",
        lastName: session.user.lastName || "",
        avatar: session.user.avatar,
      },
      isRead: true,
    }

    // In a real app, you would save this to the database
    console.log("New message created:", newMessage)

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
