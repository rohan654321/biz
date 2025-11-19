import { createWebSocketServer } from './websocket'

// Start WebSocket server
const WS_PORT = parseInt(process.env.WS_PORT || '3001', 10)

createWebSocketServer(WS_PORT)

console.log(`✅ WebSocket server started successfully on port ${WS_PORT}`)
console.log(`📡 Clients can connect to: ws://localhost:${WS_PORT}/messages?userId=<user-id>`)
