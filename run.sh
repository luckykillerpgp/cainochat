#!/bin/bash
# 🔴 CainoChat Launcher Script
# Usage: ./run.sh [server|android|ios|test]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}"
echo "╔═══════════════════════════════════════╗"
echo "║     🔴 CainoChat Launcher             ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

case "$1" in
  server)
    echo -e "${GREEN}Starting Signaling Server...${NC}"
    cd server && npm start
    ;;
    
  android)
    echo -e "${GREEN}Starting Metro Bundler...${NC}"
    npx react-native start &
    sleep 3
    echo -e "${GREEN}Launching Android...${NC}"
    npx react-native run-android
    ;;
    
  ios)
    echo -e "${GREEN}Installing iOS pods...${NC}"
    cd ios && pod install && cd ..
    echo -e "${GREEN}Starting Metro Bundler...${NC}"
    npx react-native start &
    sleep 3
    echo -e "${GREEN}Launching iOS...${NC}"
    npx react-native run-ios
    ;;
    
  test)
    echo -e "${GREEN}Running tests...${NC}"
    echo ""
    echo -e "${BLUE}📊 Project Structure:${NC}"
    echo "  Screens: $(find src/screens -name '*.js' | wc -l)"
    echo "  Components: $(find src/components -name '*.js' | wc -l)"
    echo "  Services: $(find src/services -name '*.js' | wc -l)"
    echo ""
    echo -e "${BLUE}📦 Dependencies:${NC}"
    echo "  Installed: $(ls node_modules 2>/dev/null | wc -l) packages"
    echo ""
    echo -e "${BLUE}🔌 Testing Signaling Server...${NC}"
    cd server && node -e "
    const WebSocket = require('ws');
    const ws = new WebSocket('ws://localhost:8081');
    ws.on('open', () => {
      console.log('  ✅ Server is reachable');
      ws.close();
      process.exit(0);
    });
    ws.on('error', () => {
      console.log('  ❌ Server not running (start with: ./run.sh server)');
      process.exit(1);
    });
    "
    ;;
    
  setup)
    echo -e "${GREEN}Setting up CainoChat...${NC}"
    echo ""
    echo -e "${BLUE}1. Installing app dependencies...${NC}"
    npm install
    echo ""
    echo -e "${BLUE}2. Installing server dependencies...${NC}"
    cd server && npm install && cd ..
    echo ""
    echo -e "${BLUE}3. iOS pods (skip on non-macOS)...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      cd ios && pod install && cd ..
      echo "  ✅ Pods installed"
    else
      echo "  ⏭️  Skipped (not macOS)"
    fi
    echo ""
    echo -e "${GREEN}✅ Setup complete!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. ./run.sh server   # Start signaling server"
    echo "  2. ./run.sh android  # Run on Android"
    echo "  2. ./run.sh ios      # Run on iOS"
    ;;
    
  *)
    echo -e "${YELLOW}Usage: ./run.sh [command]${NC}"
    echo ""
    echo "Commands:"
    echo "  setup    Install all dependencies"
    echo "  server   Start the signaling server"
    echo "  android  Run on Android device/emulator"
    echo "  ios      Run on iOS device/simulator"
    echo "  test     Run project health checks"
    echo ""
    echo -e "${GREEN}Quick start:${NC}"
    echo "  ./run.sh setup"
    echo "  ./run.sh server    # Terminal 1"
    echo "  ./run.sh android   # Terminal 2"
    ;;
esac
