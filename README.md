# 🔴 CainoChat

**Encrypted video calling for iOS & Android. No passwords. Just code.**

[![Cross Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue)]()
[![Encryption](https://img.shields.io/badge/Encryption-E2E%20AES--256-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

---

## ✨ Features

| Feature | Free | Premium |
|---------|------|---------|
| 1-on-1 Video Calls | ✅ | ✅ |
| Audio Calls | ✅ | ✅ |
| End-to-End Encryption | ✅ | ✅ |
| OTP Login (no passwords) | ✅ | ✅ |
| QR Code Security Verification | ✅ | ✅ |
| Text Chat | ✅ | ✅ |
| Voice Messages | ✅ | ✅ |
| Disappearing Messages | ✅ | ✅ |
| App Lock (PIN + Biometric) | ✅ | ✅ |
| Contact Search | ✅ | ✅ |
| Profile Customization | ✅ | ✅ |
| Call Duration | 30 min | ♾️ Unlimited |
| Group Calls (up to 10) | ❌ | ✅ |
| HD Quality (720p/1080p) | ❌ | ✅ |
| Screen Sharing | ❌ | ✅ |
| In-Call Chat | ❌ | ✅ |
| Call Quality Stats | ❌ | ✅ |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   CainoChat App                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │   Auth   │  │  WebRTC  │  │  Encryption   │ │
│  │ OTP Flow │  │  Calls   │  │  AES-256-GCM  │ │
│  └──────────┘  └──────────┘  └───────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │  QR Code │  │ Signaling│  │  State (Zust.)│ │
│  │ Security │  │  Client  │  │               │ │
│  └──────────┘  └──────────┘  └───────────────┘ │
└─────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  ┌─────────────┐    ┌──────────────┐
  │  OTP Server │    │  Signaling   │
  │  (Firebase) │    │  Server (WS) │
  └─────────────┘    └──────────────┘
```

## 📱 Screenshots

| Welcome | Login | Home | Call |
|---------|-------|------|------|
| Dark + Red theme | OTP entry | Contact list | Video call with controls |
| Animated logo | Phone/Email toggle | Search + tabs | PiP self-view |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- CocoaPods (for iOS)

### 1. Install Dependencies

```bash
# Install app dependencies
cd cainochat
npm install

# Install iOS pods
cd ios && pod install && cd ..

# Install signaling server dependencies
cd server && npm install && cd ..
```

### 2. Start the Signaling Server

```bash
npm run server
# Or directly:
node server/signaling-server.js
```

The server runs on `ws://localhost:8081` by default.

### 3. Run the App

**Android:**
```bash
npx react-native run-android
```

**iOS:**
```bash
npx react-native run-ios
```

## 🔐 Security

### End-to-End Encryption
- All video/audio streams use **WebRTC DTLS-SRTP** encryption
- Messages encrypted with **AES-256-GCM**
- Key exchange via **SHA-256** hashing

### OTP Authentication
- No passwords stored anywhere
- 6-digit one-time code via SMS or email
- Codes expire after 5 minutes

### QR Code Verification
- Each user gets a unique security QR code
- Scan to verify contact identity (like Signal's safety numbers)
- Prevents man-in-the-middle attacks

## 📲 QR Code Installation

The app includes a shareable QR code that:
1. Links to `https://cainochat.app/install`
2. Auto-detects Android vs iOS
3. Redirects to Google Play or App Store

Share from Settings → "Show Install QR Code"

## 🗂️ Project Structure

```
cainochat/
├── App.js                      # Main app with navigation
├── package.json                # Dependencies
├── babel.config.js             # Babel config
├── metro.config.js             # Metro bundler config
├── index.js                    # Entry point
├── app.json                    # App config
├── src/
│   ├── theme/
│   │   └── colors.js           # Dark + Red theme
│   ├── context/
│   │   └── AuthContext.js      # Auth state management
│   ├── services/
│   │   ├── auth.js             # OTP authentication
│   │   ├── webrtc.js           # WebRTC video calls
│   │   ├── signaling.js        # WebSocket signaling
│   │   └── encryption.js       # AES-256 + QR security
│   ├── utils/
│   │   └── helpers.js          # Mock data & utilities
│   ├── components/
│   │   ├── CallControls.js     # In-call buttons
│   │   ├── ContactCard.js      # Contact list item
│   │   ├── TierBadge.js        # Free/Premium badge
│   │   └── VideoView.js        # Video display wrapper
│   └── screens/
│       ├── WelcomeScreen.js    # Animated landing
│       ├── LoginScreen.js      # Phone/email input
│       ├── OTPVerifyScreen.js  # 6-digit code entry
│       ├── HomeScreen.js       # Contacts + history
│       ├── CallScreen.js       # Full video call UI
│       ├── SettingsScreen.js   # Settings + install QR
│       └── SecurityScreen.js   # QR code verification
├── server/
│   ├── package.json            # Server dependencies
│   └── signaling-server.js     # WebRTC signaling
└── README.md
```

## 🎨 Design

- **Theme:** Dark charcoal (#0D0D0D) with red accents (#E53935)
- **Typography:** System fonts, bold headers
- **Animations:** React Native Reanimated for smooth transitions
- **Icons:** Emoji-based (no icon library needed)

## 🧪 Demo Mode

The app works in demo mode without a backend:
- OTP accepts **any 6-digit code** (e.g., `123456`)
- Mock contacts are pre-loaded
- Call history is simulated
- Signaling server is optional for UI testing

## 🔧 Configuration

### Change Signaling Server URL
Edit `src/services/webrtc.js`:
```js
await signaling.connect('ws://YOUR_SERVER:8081');
```

### Change Theme Colors
Edit `src/theme/colors.js`:
```js
primary: '#E53935',      // Main accent
primaryBright: '#FF1744', // Highlights
primaryDark: '#B71C1C',   // Shadows
```

### Connect Real OTP Provider
Edit `src/services/auth.js` to integrate:
- Firebase Auth
- Twilio Verify
- Vonage Verify
- AWS SNS

## 📄 License

MIT — do whatever you want with it.

---

Built with ❤️ by **luckycaino** 🎲
