# CainoChat - Eigen Server Setup

## Overzicht

CainoChat bestaat uit 2 onderdelen:
1. **Signaling Server** (Node.js) — regelt WebRTC verbindingen
2. **React Native App** — de mobiele app (Android/iOS)

Je kunt beide op je eigen server/host draaien.

---

## Stap 1: Signaling Server opzetten

### Vereisten
- Node.js 18+ op je server
- Een domein of IP-adres bereikbaar vanaf internet

### Installatie

```bash
# Op je server:
cd cainochat/server
npm install

# Starten (zonder SSL, voor testen):
node signaling-server.js

# Of met environment variables:
HOST=0.0.0.0 PORT=8081 node signaling-server.js
```

### Met SSL (aanbevolen voor productie)

```bash
# Met Let's Encrypt certificaten:
SSL_KEY=/etc/letsencrypt/live/jouwdomein.nl/privkey.pem \
SSL_CERT=/etc/letsencrypt/live/jouwdomein.nl/fullchain.pem \
node signaling-server.js
```

### Als systemd service (blijft draaien na reboot)

```bash
sudo tee /etc/systemd/system/cainochat-signaling.service << 'EOF'
[Unit]
Description=CainoChat Signaling Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/cainochat/server
ExecStart=/usr/bin/node signaling-server.js
Restart=always
RestartSec=5

# Environment
Environment=PORT=8081
Environment=HOST=0.0.0.0
# Uncomment voor SSL:
# Environment=SSL_KEY=/etc/letsencrypt/live/jouwdomein.nl/privkey.pem
# Environment=SSL_CERT=/etc/letsencrypt/live/jouwdomein.nl/fullchain.pem

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable cainochat-signaling
sudo systemctl start cainochat-signaling
```

### Firewall openen

```bash
# UFW (Ubuntu/Debian):
sudo ufw allow 8081/tcp

# Of iptables:
sudo iptables -A INPUT -p tcp --dport 8081 -j ACCEPT
```

---

## Stap 2: App configureren

Bewerk `src/config/server.js` en zet je server URL:

```javascript
const SERVER_CONFIG = {
  // Zonder SSL:
  SIGNALING_SERVER: 'ws://jouwdomein.nl:8081',

  // Met SSL:
  // SIGNALING_SERVER: 'wss://jouwdomein.nl',

  ICE_SERVERS: {
    iceServers: [
      {urls: 'stun:stun.l.google.com:19302'},
    ],
  },
};
```

### TURN Server (optioneel maar aanbevolen)

Voor gebruikers achter firewalls/NAT heb je een TURN server nodig:

**Optie 1: Coturn installeren op je eigen server**

```bash
sudo apt install coturn

# /etc/turnserver.conf:
listening-port=3478
realm=jouwdomein.nl
user=jouwuser:jouwwachtwoord
```

**Optie 2: Gratis TURN services**
- Twilio STUN/TURN (gratis tier beschikbaar)
- Cloudflare Calls (beta)

Dan toevoegen aan `ICE_SERVERS` in `server.js`:
```javascript
{
  urls: 'turn:jouwdomein.nl:3478',
  username: 'jouwuser',
  credential: 'jouwwachtwoord',
}
```

---

## Stap 3: App bouwen

```bash
cd cainochat

# Android APK:
npm run android
# Of via Android Studio: open de android/ folder

# Voor distributie:
cd android
./gradlew assembleRelease
# APK vind je in: android/app/build/outputs/apk/release/
```

---

## Stap 4: Testen

1. Start de signaling server op je server
2. Bouw de app met de juiste `SIGNALING_SERVER` URL
3. Installeer de app op 2 telefoons
4. Maak een call — check of de verbinding werkt

### Debuggen

```bash
# Server logs bekijken:
sudo journalctl -u cainochat-signaling -f

# Test WebSocket verbinding:
wscat -c ws://jouwdomein.nl:8081
```

---

## Veelvoorkomende problemen

| Probleem | Oplossing |
|----------|-----------|
| App kan niet verbinden | Check firewall, check dat HOST op `0.0.0.0` staat |
| Geen video/audio | Check TURN server, STUN is niet genoeg achter NAT |
| SSL errors | Zorg dat certificaten geldig zijn, gebruik WSS |
| Connection fails | Test eerst met `ws://` voor debugging, dan `wss://` |

---

## Structuur

```
cainochat/
├── server/
│   ├── signaling-server.js    ← De signaling server
│   └── package.json
├── src/
│   ├── config/
│   │   └── server.js          ← Server configuratie (hier aanpassen!)
│   ├── services/
│   │   ├── webrtc.js          ← WebRTC service
│   │   └── signaling.js       ← Signaling client
│   └── ...
└── ...
```
