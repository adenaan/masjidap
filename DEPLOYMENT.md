# Capacitor Deployment Guide

This guide will help you convert your React Native app to use Capacitor for easier deployment.

## Why Capacitor?

Capacitor provides:
- Easier build process
- Better web compatibility
- Simpler plugin management
- Cross-platform consistency

## Installation Steps

### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

### 2. Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name**: Masjid Al Taubah
- **App ID**: com.masjidaltaubah.app
- **Web directory**: build (or wherever your built app goes)

This creates `capacitor.config.ts`

### 3. Install Required Plugins

```bash
# For live video streaming
npm install @capacitor/browser

# For opening maps and phone
npm install @capacitor/app

# For splash screen
npm install @capacitor/splash-screen

# For status bar customization
npm install @capacitor/status-bar
```

### 4. Add Platforms

```bash
# Add iOS
npx cap add ios

# Add Android
npx cap add android
```

### 5. Configure capacitor.config.ts

Create/edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.masjidaltaubah.app',
  appName: 'Masjid Al Taubah',
  webDir: 'build',
  server: {
    androidScheme: 'https'
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

### 6. Build Your App

First, build the React Native bundle:

```bash
# For production
npm run build

# Or create a simple build script in package.json:
# "build": "react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle"
```

### 7. Sync with Native Projects

```bash
npx cap sync
```

This copies your web assets to the native projects.

### 8. Open in Native IDEs

**For iOS:**
```bash
npx cap open ios
```

**For Android:**
```bash
npx cap open android
```

## iOS Deployment (App Store)

### Prerequisites
- Mac with Xcode installed
- Apple Developer Account ($99/year)
- Your app must be built and tested

### Steps:

1. **Configure Signing**
   - Open Xcode
   - Select your project → Signing & Capabilities
   - Select your Team
   - Ensure Bundle Identifier matches: `com.masjidaltaubah.app`

2. **Update Version & Build Number**
   - In Xcode: General tab
   - Version: 1.0.0
   - Build: 1

3. **Create App Icons**
   - Use AppIcon.appiconset in Assets.xcassets
   - Need all sizes: 20x20 to 1024x1024
   - Tool: https://appicon.co/

4. **Archive the App**
   - Xcode → Product → Archive
   - Wait for archive to complete
   - Window → Organizer opens

5. **Upload to App Store**
   - Click "Distribute App"
   - Select "App Store Connect"
   - Follow the wizard
   - Upload will take 10-30 minutes

6. **App Store Connect**
   - Go to: https://appstoreconnect.apple.com
   - Fill in app details:
     - Name: Masjid Al Taubah
     - Category: Reference or Lifestyle
     - Description (see below)
     - Screenshots (required)
     - Privacy Policy URL
   - Submit for Review

### iOS Screenshots Required:
- 6.7" Display (iPhone 14 Pro Max): 1290 x 2796
- 6.5" Display (iPhone 11 Pro Max): 1242 x 2688
- 5.5" Display (iPhone 8 Plus): 1242 x 2208
- iPad Pro (12.9"): 2048 x 2732

Tip: Use iOS Simulator to capture these.

## Android Deployment (Google Play)

### Prerequisites
- Android Studio installed
- Google Play Console account ($25 one-time fee)
- App built and tested

### Steps:

1. **Generate Signing Key**
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore masjid-release.keystore -alias masjid-key -keyalg RSA -keysize 2048 -validity 10000
   ```
   
   Remember your passwords!

2. **Configure Gradle for Signing**
   
   Create `android/gradle.properties`:
   ```properties
   MASJID_UPLOAD_STORE_FILE=masjid-release.keystore
   MASJID_UPLOAD_KEY_ALIAS=masjid-key
   MASJID_UPLOAD_STORE_PASSWORD=your_store_password
   MASJID_UPLOAD_KEY_PASSWORD=your_key_password
   ```

   Edit `android/app/build.gradle`:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file(MASJID_UPLOAD_STORE_FILE)
               storePassword MASJID_UPLOAD_STORE_PASSWORD
               keyAlias MASJID_UPLOAD_KEY_ALIAS
               keyPassword MASJID_UPLOAD_KEY_PASSWORD
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. **Build Release APK/Bundle**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   
   Output: `android/app/build/outputs/bundle/release/app-release.aab`

4. **Upload to Google Play Console**
   - Go to: https://play.google.com/console
   - Create new app
   - Fill in details:
     - Name: Masjid Al Taubah
     - Category: Books & Reference or Education
     - Description (see below)
   - Upload the AAB file
   - Fill in all required details
   - Submit for review

### Android Screenshots Required:
- Phone: 1080 x 1920 (minimum 2)
- 7" Tablet: 1200 x 1920
- 10" Tablet: 1600 x 2560

Tip: Use Android Emulator to capture these.

## App Store Descriptions

### Short Description (80 chars)
"Stay connected with Masjid Al Taubah - Announcements, Events, Prayer Times"

### Full Description

```
Stay connected with Masjid Al Taubah through our official mobile app.

FEATURES:
• Latest announcements and updates
• Upcoming events and programs
• Educational programs schedule
• Photo gallery
• Live broadcasts
• Contact information
• Donation details
• Prayer times and schedules

Download now to stay informed about all mosque activities and community events.

Established [Year] - Serving the community with faith and dedication.

Contact: [Your Contact Info]
Website: https://masjidaltaubah.co.za
```

## Testing Before Release

### iOS TestFlight
1. After archiving, select "TestFlight & App Store"
2. Add internal testers (up to 100 free)
3. They get email to download TestFlight app
4. Test thoroughly before submitting

### Android Internal Testing
1. In Play Console → Testing → Internal testing
2. Upload your AAB
3. Add testers by email
4. They can download and test

## Update Workflow

When you update your app:

1. Make changes to code
2. Update version number in `app.json`
3. Build: `npm run build`
4. Sync: `npx cap sync`
5. Archive/Build in Xcode/Android Studio
6. Upload to App Store/Play Store

## Common Issues

### iOS Build Fails
- Clean build folder: Xcode → Product → Clean Build Folder
- Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- Re-install pods: `cd ios && pod install`

### Android Build Fails
- Clean: `cd android && ./gradlew clean`
- Check Java version: `java -version` (should be 11 or 17)
- Invalidate caches in Android Studio

### App Rejected from Store
- Read rejection reason carefully
- Common issues: missing privacy policy, unclear screenshots, broken links
- Fix and resubmit

## Tips for Approval

✅ **Do:**
- Test on real devices
- Provide clear screenshots
- Have a privacy policy
- Test all features work
- Provide accurate descriptions

❌ **Don't:**
- Submit with bugs
- Use misleading descriptions
- Forget to test on different screen sizes
- Skip privacy policy
- Use low-quality screenshots

## Need Help?

- **iOS Review Status**: https://appstoreconnect.apple.com
- **Android Review Status**: https://play.google.com/console
- **Capacitor Docs**: https://capacitorjs.com/docs
- **React Native Docs**: https://reactnative.dev/

---

Remember: First approval can take 1-7 days. Be patient and respond quickly to any questions from review teams!
