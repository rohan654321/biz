import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get user's connections (both sent and received)
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        status: {
          in: ["PENDING", "ACCEPTED"]
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            jobTitle: true,
            company: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            jobTitle: true,
            company: true,
            avatar: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Format the connections for the frontend
    const formattedConnections = connections.map(conn => {
      const otherUser = conn.senderId === userId ? conn.receiver : conn.sender
      const status = conn.status === "ACCEPTED" ? "connected" : 
                    conn.senderId === userId ? "pending" : "request_received"
      
      return {
        id: conn.id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        jobTitle: otherUser.jobTitle,
        company: otherUser.company,
        avatar: otherUser.avatar,
        status: status,
        connectionId: conn.id
      }
    })

    return NextResponse.json({ connections: formattedConnections })
  } catch (error) {
    console.error("Error fetching connections:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = id
    const { receiverId, message } = await request.json()

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 })
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      }
    })

    if (existingConnection) {
      return NextResponse.json(
        { error: "Connection already exists" }, 
        { status: 400 }
      )
    }

    // Create new connection request
    const connection = await prisma.connection.create({
      data: {
        senderId: userId,
        receiverId,
        message,
        status: "PENDING"
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            jobTitle: true,
            company: true,
            avatar: true
          }
        }
      }
    })

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "CONNECTION_REQUEST",
        title: "New Connection Request",
        message: `${session.user.firstName} ${session.user.lastName} wants to connect with you`,
        channels: ["PUSH", "EMAIL"],
        metadata: {
          connectionId: connection.id,
          senderId: userId,
          senderName: `${session.user.firstName} ${session.user.lastName}`
        }
      }
    })

    return NextResponse.json({ 
      connection: {
        id: connection.id,
        firstName: connection.receiver.firstName,
        lastName: connection.receiver.lastName,
        jobTitle: connection.receiver.jobTitle,
        company: connection.receiver.company,
        avatar: connection.receiver.avatar,
        status: "pending"
      }
    })
  } catch (error) {
    console.error("Error creating connection:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}