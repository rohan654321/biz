import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { parse } from 'url'

interface Client {
  ws: WebSocket
  userId: string
  isAlive: boolean
}   

interface WebSocketMessage {
  type: 'NEW_MESSAGE' | 'MESSAGES_READ' | 'USER_STATUS' | 'PING'
  message?: any
  messageId?: string
  contactId?: string
  userId?: string
  isOnline?: boolean
}

const clients = new Map<string, Client>()

export function createWebSocketServer(port: number = 3001) {
  const wss = new WebSocketServer({ port })

  console.log(`[WebSocket] Server running on ws://localhost:${port}`)

  // Heartbeat to detect broken connections
  const heartbeat = setInterval(() => {
    clients.forEach((client, userId) => {
      if (client.isAlive === false) {
        console.log(`[WebSocket] Terminating inactive connection for user: ${userId}`)
        client.ws.terminate()
        clients.delete(userId)
        broadcastUserStatus(userId, false)
        return
      }
      client.isAlive = false
      client.ws.ping()
    })
  }, 30000) // Check every 30 seconds

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    const { query } = parse(request.url || '', true)
    const userId = query.userId as string

    if (!userId) {
      console.log('[WebSocket] Connection rejected: No userId provided')
      ws.close(1008, 'User ID required')
      return
    }

    console.log(`[WebSocket] New connection from user: ${userId}`)

    // Store client connection
    const client: Client = { ws, userId, isAlive: true }
    clients.set(userId, client)

    // Broadcast user online status
    broadcastUserStatus(userId, true)

    // Send confirmation
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'Connected to WebSocket server',
      userId
    }))

    // Handle pong responses
    ws.on('pong', () => {
      const client = clients.get(userId)
      if (client) {
        client.isAlive = true
      }
    })

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString())
        console.log(`[WebSocket] Received from ${userId}:`, message.type)

        switch (message.type) {
          case 'NEW_MESSAGE':
            handleNewMessage(userId, message)
            break
          
          case 'MESSAGES_READ':
            handleMessagesRead(userId, message)
            break
          
          case 'PING':
            ws.send(JSON.stringify({ type: 'PONG' }))
            break
          
          default:
            console.log(`[WebSocket] Unknown message type: ${message.type}`)
        }
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error)
      }
    })

    // Handle disconnection
    ws.on('close', () => {
      console.log(`[WebSocket] User disconnected: ${userId}`)
      clients.delete(userId)
      broadcastUserStatus(userId, false)
    })

    ws.on('error', (error) => {
      console.error(`[WebSocket] Error for user ${userId}:`, error)
    })
  })

  wss.on('close', () => {
    clearInterval(heartbeat)
    console.log('[WebSocket] Server closed')
  })

  return wss
}

function handleNewMessage(senderId: string, data: WebSocketMessage) {
  if (!data.message) return

  const receiverId = data.message.receiverId
  const receiverClient = clients.get(receiverId)

  if (receiverClient && receiverClient.ws.readyState === WebSocket.OPEN) {
    console.log(`[WebSocket] Sending message to ${receiverId}`)
    receiverClient.ws.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      message: data.message
    }))
  } else {
    console.log(`[WebSocket] Receiver ${receiverId} is offline`)
  }

  // Also send confirmation back to sender
  const senderClient = clients.get(senderId)
  if (senderClient && senderClient.ws.readyState === WebSocket.OPEN) {
    senderClient.ws.send(JSON.stringify({
      type: 'MESSAGE_SENT',
      message: data.message
    }))
  }
}

function handleMessagesRead(userId: string, data: WebSocketMessage) {
  if (!data.contactId) return

  const contactClient = clients.get(data.contactId)
  
  if (contactClient && contactClient.ws.readyState === WebSocket.OPEN) {
    console.log(`[WebSocket] Notifying ${data.contactId} that messages were read`)
    contactClient.ws.send(JSON.stringify({
      type: 'MESSAGES_READ',
      userId: userId
    }))
  }
}

function broadcastUserStatus(userId: string, isOnline: boolean) {
  console.log(`[WebSocket] Broadcasting status for ${userId}: ${isOnline ? 'online' : 'offline'}`)
  
  const statusMessage = JSON.stringify({
    type: 'USER_STATUS',
    userId,
    isOnline
  })

  // Broadcast to all connected clients except the user themselves
  clients.forEach((client, clientId) => {
    if (clientId !== userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(statusMessage)
    }
  })
}

export function getConnectedUsers(): string[] {
  return Array.from(clients.keys())
}

export function isUserOnline(userId: string): boolean {
  return clients.has(userId)
}

export function sendToUser(userId: string, message: any) {
  const client = clients.get(userId)
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message))
    return true
  }
  return false
}
