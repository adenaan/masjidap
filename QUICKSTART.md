# 🚀 Quick Start Guide

Get your Masjid Al Taubah mobile app running in minutes!

## What You Need

- A computer (Mac for iOS, Mac/Windows/Linux for Android)
- Internet connection
- Your existing website is already running at https://masjidaltaubah.co.za/api

## Step-by-Step Setup

### 1️⃣ Install Node.js (if you don't have it)

Download from: https://nodejs.org/
- Choose the LTS version (18 or newer)
- Install it and restart your computer

### 2️⃣ Install Dependencies

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd MasjidAlTaubahApp
npm install
```

This will download all required packages (takes 5-10 minutes).

### 3️⃣ Run on Android (Easiest Option)

#### Install Android Studio:
1. Download from: https://developer.android.com/studio
2. Install it
3. Open Android Studio → More Actions → Virtual Device Manager
4. Create a new device (Pixel 5 recommended)
5. Start the virtual device

#### Run the app:
```bash
npm run android
```

The app will open in the Android emulator!

### 4️⃣ Run on iOS (Mac only)

#### Install Xcode:
1. Download from Mac App Store (it's free but large ~12GB)
2. Open Xcode once to install components
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

#### Setup and run:
```bash
cd ios
pod install
cd ..
npm run ios
```

The app will open in the iOS Simulator!

## 🎉 That's It!

Your app is now running and connected to your live API at https://masjidaltaubah.co.za/api

### What Can You Do?

✅ **Update Content**: Edit anything in your web admin panel - the app automatically shows the updates!

✅ **Test Features**:
- Browse announcements
- View events and programs
- Check the gallery
- Watch live broadcasts
- See contact information

## Next Steps for Production

### For Real Devices:

**Android:**
1. Enable Developer Mode on your Android phone
2. Connect phone via USB
3. Run: `npm run android`

**iPhone:**
1. Need Apple Developer account ($99/year)
2. Open `ios/MasjidAlTaubah.xcworkspace` in Xcode
3. Select your device and click Run

### For App Stores:

See the full README.md for detailed Capacitor setup instructions.

## Common Issues

### "Command not found: npm"
→ Install Node.js first (step 1)

### "Unable to resolve module"
→ Run: `npm install` again

### Android won't start
→ Make sure virtual device is running in Android Studio

### iOS won't start (Mac)
→ Run: `cd ios && pod install && cd ..`

## Need Help?

- Check `README.md` for detailed docs
- Make sure your API is running at https://masjidaltaubah.co.za/api
- Try: `npm start -- --reset-cache` to clear cache

---

**Pro Tip**: Keep your web admin panel open - any changes you make there will show up in the app when you refresh! 🔄
