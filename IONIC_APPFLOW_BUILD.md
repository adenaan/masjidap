# 🚀 Building APK with Ionic Appflow (Online Build)

This guide shows you how to build your React Native app into an APK using Ionic's online build service (Appflow) - **no need for Android Studio on your computer!**

## 📋 What You Need

1. Ionic Appflow account (has free tier)
2. Git/GitHub account
3. Your React Native code
4. Internet connection

## Step 1: Convert React Native to Capacitor

Since you want to keep React Native but build with Ionic, we need to add Capacitor as the bridge.

### Install Capacitor

```bash
cd MasjidAlTaubahApp

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Install Capacitor plugins
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar
```

### Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name**: Masjid Al Taubah
- **App ID**: com.masjidaltaubah.app
- **Web directory**: www

### Create capacitor.config.ts

Create this file in your project root:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.masjidaltaubah.app',
  appName: 'Masjid Al Taubah',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0B1430',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0B1430',
    },
  },
};

export default config;
```

### Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "build:android": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res",
    "build:web": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output www/index.js && cp -r android/app/src/main/res/* www/",
    "cap:sync": "npm run build:web && cap sync",
    "cap:android": "cap add android",
    "cap:copy": "cap copy"
  }
}
```

## Step 2: Add Android Platform

```bash
npx cap add android
```

This creates the `android` folder.

## Step 3: Prepare for Web Build (Required by Capacitor)

Create a simple `www` folder structure:

```bash
mkdir -p www
```

Create `www/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masjid Al Taubah</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background-color: #0B1430;
      color: #F3F0E6;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    #root {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>
```

## Step 4: Build the Bundle

```bash
# Build React Native bundle for Android
npm run build:android

# Or use this manual command:
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output www/index.js \
  --assets-dest www/
```

## Step 5: Sync with Capacitor

```bash
npx cap sync android
```

## Step 6: Set Up Ionic Appflow

### A. Create Account

1. Go to https://ionic.io/appflow
2. Sign up (free tier available)
3. Create new app: "Masjid Al Taubah"

### B. Install Ionic CLI

```bash
npm install -g @ionic/cli
```

### C. Link Your App

```bash
ionic login

# Link to Appflow
ionic link
```

Choose your app from the list.

### D. Create ionic.config.json

Create this in your project root:

```json
{
  "name": "Masjid Al Taubah",
  "integrations": {
    "capacitor": {}
  },
  "type": "react"
}
```

## Step 7: Push to Git

Appflow builds from Git, so push your code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Appflow build"

# Add Ionic remote (Appflow provides this)
git remote add ionic YOUR_IONIC_GIT_URL

# Push
git push ionic master
```

**OR** use GitHub:

```bash
# Push to GitHub
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

Then connect GitHub to Appflow in the dashboard.

## Step 8: Build in Appflow Dashboard

### A. Go to Appflow Dashboard

1. Visit https://dashboard.ionicframework.com
2. Select your app
3. Go to "Build" → "Native"

### B. Configure Android Build

1. Click "New Build"
2. Select:
   - **Platform**: Android
   - **Build Type**: Release
   - **Commit**: latest
3. Click "Build"

### C. Wait for Build

- Build takes 5-15 minutes
- You'll see live logs
- Download APK when done!

## Step 9: Sign Your APK (Optional for Play Store)

For Google Play Store, you need a signed APK.

### Generate Keystore

```bash
keytool -genkey -v -keystore masjid-release.keystore -alias masjid-key -keyalg RSA -keysize 2048 -validity 10000
```

Save this keystore file securely!

### Upload to Appflow

1. In Appflow → Settings → Certificates
2. Upload your keystore
3. Add credentials (passwords)

### Build with Signing

1. Create new build
2. Select your certificate
3. Build!

Now you get a **signed APK** ready for Play Store!

## Alternative: Capacitor Live Updates

If you just want to test without full build:

```bash
# Install live update CLI
npm install -g @capacitor/cli

# Run live reload
npx cap run android -l --external
```

## 🎯 Simple Build Script

Add this to your project root as `build.sh`:

```bash
#!/bin/bash

echo "🚀 Building Masjid Al Taubah App..."

# Clean previous builds
rm -rf www/*
rm -rf android/app/src/main/assets/*.bundle

# Build React Native bundle
echo "📦 Bundling React Native..."
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output www/index.js \
  --assets-dest www/

# Copy to Android assets
mkdir -p android/app/src/main/assets
cp www/index.js android/app/src/main/assets/index.android.bundle

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

echo "✅ Build complete! Ready to upload to Appflow or build locally."
```

Make it executable:
```bash
chmod +x build.sh
./build.sh
```

## 📱 Local Build (Without Appflow)

If you want to build locally instead:

```bash
# After running build.sh above:
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (unsigned)
./gradlew assembleRelease

# APK location:
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 Troubleshooting

### "Module not found"
```bash
npm install
npx cap sync
```

### "Build failed in Appflow"
- Check build logs in dashboard
- Ensure all dependencies in package.json
- Make sure capacitor.config.ts is correct

### "App won't open on device"
- Check AndroidManifest.xml has correct permissions
- Ensure INTERNET permission is added

### "White screen on app start"
```bash
# Rebuild bundle
npm run build:android
npx cap sync
```

## 📋 Checklist Before Building

- [ ] `capacitor.config.ts` created
- [ ] `www` folder with index.html
- [ ] Android platform added (`npx cap add android`)
- [ ] Bundle built (`npm run build:android`)
- [ ] Capacitor synced (`npx cap sync`)
- [ ] Code pushed to Git
- [ ] Appflow account created
- [ ] App linked to Appflow

## 🎁 Benefits of Appflow

✅ No need for Android Studio locally  
✅ Build in the cloud  
✅ Works on any computer (Mac/Windows/Linux)  
✅ Automated builds  
✅ Easy distribution  
✅ Live updates support  

## 💰 Appflow Pricing

- **Hobby/Free**: 500 builds/month (enough for testing)
- **Launch**: $499/month (unlimited builds)
- **Growth**: $2999/month (team features)

For just getting an APK, the free tier works fine!

## 🚀 Summary

1. Add Capacitor to your React Native project
2. Build React Native bundle
3. Sync with Capacitor
4. Push to Git
5. Build in Appflow dashboard
6. Download APK!

**No Android Studio needed!** ✨

---

**Pro Tip**: For production, always use signed builds with your keystore!
