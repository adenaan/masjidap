# 🚀 Building Pure React Native APK Online (No Capacitor!)

This guide shows you how to build your **pure React Native app** into an APK using **online build services** - no Android Studio needed!

## 🎯 Best Online Build Services for React Native

### Option 1: EAS Build (Expo Application Services) - RECOMMENDED ✨
- **FREE tier available**
- Works with React Native (even non-Expo apps!)
- Easy setup
- Best option for pure React Native

### Option 2: Bitrise
- CI/CD platform
- Free tier for open source
- More complex setup

### Option 3: GitHub Actions + Gradle Cloud
- Free for public repos
- Automated builds
- Requires GitHub

---

## 🏆 OPTION 1: EAS Build (Easiest!)

Even though your app isn't Expo, EAS Build works with pure React Native!

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Create Expo Account

```bash
eas login
```

Sign up at https://expo.dev (FREE!)

### Step 3: Configure Your Project

In your `MasjidAlTaubahApp` folder:

```bash
# Initialize EAS
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 4: Update app.json

Make sure your `app.json` has:

```json
{
  "expo": {
    "name": "Masjid Al Taubah",
    "slug": "masjid-al-taubah",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B1430"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0B1430"
      },
      "package": "com.masjidaltaubah.app",
      "versionCode": 1
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.masjidaltaubah.app"
    }
  }
}
```

### Step 5: Create App Icons (Required!)

You need these images in an `assets` folder:

```bash
mkdir -p assets
```

Download or create:
- `icon.png` - 1024x1024 (app icon)
- `splash.png` - 2048x2048 (splash screen)
- `adaptive-icon.png` - 1024x1024 (Android adaptive icon)

**Quick icon tip**: Use https://appicon.co to generate all sizes!

### Step 6: Build APK Online!

```bash
# Build for Android (APK)
eas build --platform android --profile preview

# Or for production (AAB for Play Store)
eas build --platform android --profile production
```

**What happens:**
1. Uploads your code to EAS servers
2. Builds APK in the cloud (10-20 min)
3. Gives you download link!

### Step 7: Download Your APK

After build completes:
- Check your terminal for download link
- Or go to https://expo.dev/accounts/[your-username]/projects/masjid-al-taubah/builds
- Download APK!

### Step 8: Install on Phone

```bash
# Option 1: Download directly on phone
# Open the download link on your Android phone

# Option 2: Transfer via USB
adb install your-app.apk

# Option 3: Use EAS CLI
eas build:run --platform android
```

---

## 🔧 OPTION 2: GitHub Actions (FREE!)

Build automatically when you push code to GitHub.

### Step 1: Create GitHub Repo

```bash
cd MasjidAlTaubahApp
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/masjid-app.git
git push -u origin main
```

### Step 2: Create Workflow File

Create `.github/workflows/android-build.yml`:

```yaml
name: Android Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Make Gradlew executable
      run: chmod +x android/gradlew
    
    - name: Build Android APK
      run: |
        cd android
        ./gradlew assembleRelease
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release
        path: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Step 3: Push and Build

```bash
git add .github/
git commit -m "Add Android build workflow"
git push
```

Go to GitHub → Actions tab → Download APK when done!

---

## 📦 OPTION 3: Build Locally (Simplest!)

If you have any computer, you can build locally without full Android Studio:

### Install Java JDK Only

```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17

# Windows
# Download from: https://adoptium.net/
```

### Build APK

```bash
cd MasjidAlTaubahApp/android

# Make gradlew executable (Mac/Linux)
chmod +x gradlew

# Build debug APK (for testing)
./gradlew assembleDebug

# Build release APK (for distribution)
./gradlew assembleRelease
```

**APK Location:**
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 🔐 Signing Your APK (For Play Store)

### Generate Keystore

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Enter your details when prompted. **SAVE THE PASSWORDS!**

### Configure Gradle Signing

Edit `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=YOUR_STORE_PASSWORD
MYAPP_RELEASE_KEY_PASSWORD=YOUR_KEY_PASSWORD
```

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

### Build Signed APK

```bash
cd android
./gradlew assembleRelease

# Signed APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 Create App Icons Fast

### Using Online Tool:

1. Create a 1024x1024 PNG icon
2. Go to https://easyappicon.com or https://appicon.co
3. Upload your icon
4. Download Android package
5. Replace in `android/app/src/main/res/`

### Icon Folders:
- `mipmap-hdpi` - 72x72
- `mipmap-mdpi` - 48x48
- `mipmap-xhdpi` - 96x96
- `mipmap-xxhdpi` - 144x144
- `mipmap-xxxhdpi` - 192x192

---

## 📱 Test Your APK

### On Real Device:

```bash
# Enable USB debugging on your phone
# Settings → About Phone → Tap "Build Number" 7 times
# Settings → Developer Options → Enable "USB Debugging"

# Install via ADB
adb install app-release.apk
```

### On Emulator:

```bash
# If you have Android SDK installed
emulator -avd YOUR_AVD_NAME

# Then install
adb install app-release.apk
```

---

## 🚀 Quick Build Script

Save as `build-apk.sh`:

```bash
#!/bin/bash

echo "🚀 Building Masjid Al Taubah APK..."

# Navigate to android folder
cd android

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build release APK
echo "📦 Building release APK..."
./gradlew assembleRelease

# Check if build succeeded
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    
    # Copy to root for easy access
    cp app/build/outputs/apk/release/app-release.apk ../masjid-app.apk
    echo "📁 Copied to: masjid-app.apk"
else
    echo "❌ Build failed. Check errors above."
fi
```

Run it:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

---

## 🎯 Comparison: Which Option?

| Option | Setup Time | Build Time | Cost | Best For |
|--------|-----------|------------|------|----------|
| **EAS Build** | 10 min | 15-20 min | FREE tier | Easiest, recommended! |
| **GitHub Actions** | 20 min | 15-25 min | FREE | Automation fans |
| **Local Build** | 5 min | 5-10 min | FREE | Have Java installed |

## ✅ Recommended: EAS Build

**Why?**
- No Android Studio needed
- No local setup
- Works from any computer
- Free tier: 30 builds/month
- Automatic signing
- Easy updates

**Steps:**
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Done! Download APK from link! 🎉

---

## 📋 Pre-Build Checklist

- [ ] `package.json` has correct name and version
- [ ] `app.json` configured
- [ ] App icons created (1024x1024)
- [ ] API URL is correct in `src/api/client.ts`
- [ ] Tested app locally with `npm start`
- [ ] For Play Store: Keystore generated

---

## 🐛 Common Issues

### "SDK location not found"
Create `android/local.properties`:
```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

### "Gradle sync failed"
```bash
cd android
./gradlew clean
rm -rf .gradle
./gradlew assembleRelease
```

### "Execution failed for task ':app:mergeReleaseResources'"
Remove duplicate resources in `android/app/src/main/res/`

### "App crashes on start"
Check:
- API URL is reachable
- Internet permission in AndroidManifest.xml
- All npm packages installed

---

## 🎁 Pro Tips

1. **Use EAS Build** - easiest and free!
2. **Always test debug APK first** before release
3. **Keep your keystore safe** - you can't update app without it!
4. **Version your builds** - increment versionCode in app.json
5. **Test on real device** - emulators don't show all issues

---

## 📞 Need Help?

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- React Native Docs: https://reactnative.dev/docs/signed-apk-android
- Stack Overflow: Search "react native build apk"

---

**Your app is pure React Native - no Capacitor, no Expo runtime, just native code!** 🚀
