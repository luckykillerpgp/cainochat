# 🔴 CainoChat Android Build Guide

## Quick APK Build (5 minuten)

### Stap 1: Vereisten
- **Node.js** 18+ → https://nodejs.org
- **Java 17** → https://adoptium.net
- **Android Studio** → https://developer.android.com/studio

### Stap 2: Project downloaden
```bash
# Kopieer de cainochat folder naar je computer
# Of als het in een git repo zit:
git clone <your-repo-url>
cd cainochat
```

### Stap 3: Setup
```bash
# Installeer dependencies
npm install

# Start signaling server (in apart terminal)
cd server && npm install && npm start
```

### Stap 4: Android configureren
```bash
# Maak Android project aan (eenmalig)
npx @react-native-community/cli init CainoChatBuild --version 0.73.4
cp -r src/ CainoChatBuild/src/
cp App.js CainoChatBuild/
cp app.json CainoChatBuild/
cp package.json CainoChatBuild/
cd CainoChatBuild
npm install
```

### Stap 5: APK bouwen
```bash
cd android

# Voor debug APK:
./gradlew assembleDebug

# Voor release APK:
./gradlew assembleRelease
```

### Stap 6: APK vinden
```
Debug:  android/app/build/outputs/apk/debug/app-debug.apk
Release: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Stap 7: Installeren op telefoon
```bash
# Via ADB:
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Of kopieer het APK bestand naar je telefoon en installeer het
```

## Environment Variables (optioneel)
Voeg toe aan je `~/.bashrc` of `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/path/to/your/jdk-17
```
