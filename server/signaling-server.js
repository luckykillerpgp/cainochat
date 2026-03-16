/**
 * CainoChat Signaling Server
 *
 * Handles WebRTC signaling: room management, SDP offers/answers,
 * and ICE candidate exchange between peers.
 *
 * Usage:
 *   node signaling-server.js
 *
 * Environment variables:
 *   PORT=8081              — Server poort (default: 8081)
 *   HOST=0.0.0.0           — Bind adres (default: 0.0.0.0)
 *   SSL_KEY=/path/key.pem  — SSL private key (voor WSS)
 *   SSL_CERT=/path/cert.pem — SSL certificaat (voor WSS)
 */

const {WebSocketServer} = require('ws');
const fs = require('fs');
const https = require('https');

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || '0.0.0.0';
const SSL_KEY = process.env.SSL_KEY;
const SSL_CERT = process.env.SSL_CERT;

let wss;
let protocol = 'ws';

// Start with SSL if certificates are provided
if (SSL_KEY && SSL_CERT) {
  const server = https.createServer({
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT),
  });
  wss = new WebSocketServer({server});
  server.listen(PORT, HOST, () => {
    protocol = 'wss';
    logStartup();
  });
} else {
  wss = new WebSocketServer({port: PORT, host: HOST});
  logStartup();
}

function logStartup() {
  console.log(`
╔═══════════════════════════════════════════╗
║     🔴 CainoChat Signaling Server        ║
║     Running on ${protocol}://${HOST}:${PORT}       ║
╚═══════════════════════════════════════════╝
`);
  if (protocol === 'ws') {
    console.log('⚠️  Running without SSL — use only for local development!');
    console.log('   Set SSL_KEY and SSL_CERT for production (WSS).\n');
  }
}

// Room storage
const rooms = new Map();
// Connection to user mapping
const connections = new Map();

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
