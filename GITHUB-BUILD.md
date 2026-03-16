# 🚀 GitHub Actions APK Build

## Stap-voor-stap:

### 1. Maak een GitHub account (als je die nog niet hebt)
→ https://github.com/signup

### 2. Maak een nieuwe repository
→ https://github.com/new
- Naam: `cainochat`
- Zet op **Public** (gratis builds)
- Klik "Create repository"

### 3. Upload het project
```bash
# In de cainochat folder:
git init
git add .
git commit -m "Initial CainoChat build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cainochat.git
git push -u origin main
```

### 4. De APK wordt automatisch gebouwd!
- Ga naar je repo → **Actions** tab
- Je ziet "Build Android APK" running
- Wacht ~5-10 minuten
- Download de APK onder **Artifacts** → `cainochat-debug-apk`

### 5. Installeer op je telefoon
- Download het APK bestand
- Open het op je Android telefoon
- Sta "Onbekende bronnen" toe
- CainoChat wordt geïnstalleerd! 📱

## Automatische builds
Elke keer je code pusht naar GitHub, wordt er automatisch een nieuwe APK gebouwd.

De APK wordt ook geüpload naar **Releases** zodat je makkelijk kan downloaden.
