// WebRTC Signaling Client
// Connects to the signaling server to exchange SDP offers/answers and ICE candidates

class SignalingClient {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnect = 5;
  }

  connect(serverUrl) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(serverUrl);

        this.ws.onopen = () => {
          console.log('[Signaling] Connected to server');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('[Signaling] Received:', message.type);
            this._emit(message.type, message);
          } catch (e) {
            console.error('[Signaling] Parse error:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[Signaling] Error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[Signaling] Disconnected');
          this._emit('disconnect', {});
          this._tryReconnect(serverUrl);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  _tryReconnect(serverUrl) {
    if (this.reconnectAttempts < this.maxReconnect) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`[Signaling] Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(serverUrl).catch(() => {}), delay);
    }
  }

  // Send a message to the signaling server
  send(type, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({type, ...data, timestamp: Date.now()});
      this.ws.send(message);
    }
  }

  // Join a room
  joinRoom(roomId, userId) {
    this.send('join', {roomId, userId});
  }

  // Leave a room
  leaveRoom(roomId, userId) {
    this.send('leave', {roomId, userId});
  }

  // Send an offer
  sendOffer(roomId, offer, userId) {
    this.send('offer', {roomId, offer, userId});
  }

  // Send an answer
  sendAnswer(roomId, answer, userId) {
    this.send('answer', {roomId, answer, userId});
  }

  // Send ICE candidate
  sendIceCandidate(roomId, candidate, userId) {
    this.send('ice-candidate', {roomId, candidate, userId});
  }

  // Event listener
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove listener
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton
export default new SignalingClient();
