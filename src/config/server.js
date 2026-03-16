/**
 * CainoChat Server Configuration
 *
 * Configureer hier je eigen server instellingen.
 * Voor productie: gebruik WSS (WebSocket Secure) met SSL certificaten.
 */

// ============================================
// PAST DEZE WAARDEN AAN VOOR JE EIGEN SERVER
// ============================================

const SERVER_CONFIG = {
  // Zonder SSL (voor nu):
  SIGNALING_SERVER: 'ws://77.169.25.127:8081',

  // ICE servers voor NAT traversal (STUN/TURN)
  // Voor productie heb je een TURN server nodig voor gebruikers achter firewalls
  ICE_SERVERS: {
    iceServers: [
      // Google STUN (gratis, werkt voor meeste directe verbindingen)
      {urls: 'stun:stun.l.google.com:19302'},
      {urls: 'stun:stun1.l.google.com:19302'},

      // Zet hier je eigen TURN server als je die hebt:
      // {
      //   urls: 'turn:turn.jouwdomein.nl:3478',
      //   username: 'jouw-username',
      //   credential: 'jouw-wachtwoord',
      // },
    ],
  },
};

export default SERVER_CONFIG;
