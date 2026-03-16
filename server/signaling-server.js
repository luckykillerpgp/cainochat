/**
 * CainoChat Signaling Server
 *
 * Handles WebRTC signaling: room management, SDP offers/answers,
 * and ICE candidate exchange between peers.
 *
 * Usage:
 *   npm install
 *   node signaling-server.js
 *
 * The server listens on port 8081 by default (override with PORT env var).
 */

const {WebSocketServer} = require('ws');
const {v4: uuidv4} = require('crypto');

const PORT = process.env.PORT || 8081;
const wss = new WebSocketServer({port: PORT});

// Room storage
const rooms = new Map();
// Connection to user mapping
const connections = new Map();

console.log(`
╔═══════════════════════════════════════════╗
║     🔴 CainoChat Signaling Server        ║
║     Running on ws://localhost:${PORT}       ║
╚═══════════════════════════════════════════╝
`);

wss.on('connection', (ws) => {
  const connectionId = Math.random().toString(36).substr(2, 9);
  connections.set(ws, {id: connectionId, roomId: null, userId: null});

  console.log(`[+] New connection: ${connectionId}`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(ws, message);
    } catch (e) {
      console.error(`[!] Parse error from ${connectionId}:`, e.message);
    }
  });

  ws.on('close', () => {
    const conn = connections.get(ws);
    if (conn && conn.roomId) {
      leaveRoom(ws, conn.roomId, conn.userId);
    }
    connections.delete(ws);
    console.log(`[-] Connection closed: ${connectionId}`);
  });

  ws.on('error', (err) => {
    console.error(`[!] WebSocket error:`, err.message);
  });
});

function handleMessage(ws, message) {
  const conn = connections.get(ws);
  const {type, roomId, userId} = message;

  switch (type) {
    case 'join':
      joinRoom(ws, roomId, userId);
      break;

    case 'leave':
      leaveRoom(ws, roomId, userId);
      break;

    case 'offer':
    case 'answer':
    case 'ice-candidate':
      broadcastToRoom(ws, roomId, message);
      break;

    default:
      console.log(`[?] Unknown message type: ${type}`);
  }
}

function joinRoom(ws, roomId, userId) {
  const conn = connections.get(ws);
  conn.roomId = roomId;
  conn.userId = userId;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId).add(ws);
  console.log(`[+] User ${userId} joined room ${roomId} (${rooms.get(roomId).size} users)`);

  // Notify others in the room
  broadcastToRoom(ws, roomId, {
    type: 'user-joined',
    userId,
    roomId,
    participantCount: rooms.get(roomId).size,
  });
}

function leaveRoom(ws, roomId, userId) {
  const conn = connections.get(ws);
  if (!roomId) roomId = conn?.roomId;
  if (!userId) userId = conn?.userId;

  if (roomId && rooms.has(roomId)) {
    rooms.get(roomId).delete(ws);

    // Notify others
    broadcastToRoom(ws, roomId, {
      type: 'user-left',
      userId,
      roomId,
      participantCount: rooms.get(roomId).size,
    });

    // Clean up empty rooms
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
      console.log(`[x] Room ${roomId} deleted (empty)`);
    }
  }

  if (conn) {
    conn.roomId = null;
    conn.userId = null;
  }

  console.log(`[-] User ${userId} left room ${roomId}`);
}

function broadcastToRoom(senderWs, roomId, message) {
  if (!rooms.has(roomId)) return;

  const messageStr = JSON.stringify(message);
  rooms.get(roomId).forEach((clientWs) => {
    if (clientWs !== senderWs && clientWs.readyState === 1) {
      clientWs.send(messageStr);
    }
  });
}

// Stats logging every 30 seconds
setInterval(() => {
  const totalConnections = connections.size;
  const totalRooms = rooms.size;
  if (totalConnections > 0 || totalRooms > 0) {
    console.log(`[📊] Connections: ${totalConnections} | Rooms: ${totalRooms}`);
  }
}, 30000);
