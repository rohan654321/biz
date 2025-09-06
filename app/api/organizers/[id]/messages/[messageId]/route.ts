import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// In-memory storage for demo purposes (shared reference)
const messageStorage: { [conversationId: string]: any[] } = {}

export async function DELETE(request: Request, { params }: { params: { id: string; messageId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const { id, messageId } = params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.id !== id && session.user.role !== "admin" && session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Handle demo users with in-memory storage
    if (["admin-1", "organizer-1", "superadmin-1"].includes(id)) {
      // Find and remove message from in-memory storage
      for (const conversationId in messageStorage) {
        const messages = messageStorage[conversationId]
        const messageIndex = messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex !== -1) {
          // Only allow deletion of own messages
          if (messages[messageIndex].senderId === id) {
            messages.splice(messageIndex, 1)
            return NextResponse.json({ success: true, message: "Message deleted successfully" })
          } else {
            return NextResponse.json({ error: "You can only delete your own messages" }, { status: 403 })
          }
        }
      }
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // For database users, delete the specific message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { senderId: true },
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Only allow users to delete their own messages
    if (message.senderId !== id) {
      return NextResponse.json({ error: "You can only delete your own messages" }, { status: 403 })
    }

    await prisma.message.delete({
      where: { id: messageId },
    })

    return NextResponse.json({ success: true, message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
