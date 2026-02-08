# Masjid Al Taubah Mobile App

A beautiful React Native mobile application for Masjid Al Taubah that connects to your existing web API.

## Features

- 🏠 **Home Screen** - Hero section, latest announcements, upcoming events
- 📢 **Announcements** - Categorized announcements with rich text content
- 📅 **Events & Programs** - View upcoming events and educational programs
- 🖼️ **Gallery** - Image gallery with full-screen viewing
- 📺 **Live Broadcast** - Watch live streams (YouTube/Facebook)
- ℹ️ **About & Contact** - Organization info, contact details, donations
- 💰 **Donations** - Display donation information
- 🎨 **Beautiful UI** - Matches your brand colors (Navy & Gold)
- 🔄 **Pull to Refresh** - All screens support pull-to-refresh
- 📱 **Responsive** - Works on all screen sizes

## Tech Stack

- React Native 0.73
- TypeScript
- React Navigation (Bottom Tabs + Stack)
- Axios for API calls
- React Native WebView for video broadcasts
- React Native Render HTML for rich text content
- Date-fns for date formatting

## API Integration

The app connects to your existing API at:
```
https://masjidaltaubah.co.za/api
```

### API Endpoints Used (Public - No Auth Required)

- `GET /content/site` - Site configuration
- `GET /announcements` - Published announcements
- `GET /announcements/:slug` - Single announcement
- `GET /announcement-categories` - Announcement categories
- `GET /events` - Events list
- `GET /programs` - Programs list
- `GET /contacts` - Contact information
- `GET /gallery` - Gallery images
- `GET /footer-links` - Footer links

The app automatically reads whatever you update in the admin panel on your website!

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and JDK

### Step 1: Install Dependencies

```bash
cd MasjidAlTaubahApp
npm install
```

### Step 2: iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### Step 3: Run the App

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

**For development server:**
```bash
npm start
```

## Capacitor Integration (For Production)

To use Capacitor for building production apps:

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
- App name: `Masjid Al Taubah`
- App ID: `com.masjidaltaubah.app`
- Web dir: `build` (or `dist`)

### 3. Add Platforms

```bash
npx cap add ios
npx cap add android
```

### 4. Sync and Open

```bash
# Sync web assets to native projects
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

### 5. Build for Production

**iOS (in Xcode):**
1. Select "Any iOS Device" as target
2. Product → Archive
3. Distribute App → App Store Connect

**Android (in Android Studio):**
1. Build → Generate Signed Bundle / APK
2. Follow the wizard to create a release build

## Project Structure

```
MasjidAlTaubahApp/
├── src/
│   ├── api/              # API client configuration
│   │   └── client.ts     # Axios setup & API calls
│   ├── components/       # Reusable components
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorView.tsx
│   ├── constants/        # Theme & constants
│   │   └── theme.ts
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── AnnouncementsScreen.tsx
│   │   ├── AnnouncementDetailScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   └── BroadcastScreen.tsx
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utility functions
│       └── helpers.ts
├── App.tsx               # Root component
├── index.js              # Entry point
├── package.json
└── tsconfig.json
```

## Customization

### Change API URL

Edit `src/api/client.ts`:
```typescript
export const API_BASE = 'https://your-new-url.com/api';
```

### Change Brand Colors

Edit `src/constants/theme.ts`:
```typescript
export const COLORS = {
  ink: '#0B1430',    // Primary dark color
  gold: '#D8B15A',   // Primary accent color
  sand: '#F3F0E6',   // Background color
  // ... other colors
};
```

### Update App Name & Icons

1. Update `app.json` with your app details
2. Replace icon files in `assets/` folder:
   - `icon.png` (1024x1024)
   - `splash.png` (2048x2048)
   - `adaptive-icon.png` (Android, 1024x1024)

## Features Breakdown

### 1. Home Screen
- Hero section with logo and branding
- Latest 5 announcements
- Next 3 upcoming events
- Live broadcast button
- Welcome message

### 2. Announcements
- Category filtering
- Featured images
- Pinned announcements
- Rich HTML content
- Publication dates

### 3. Events & Programs
- Tab-based interface
- One-time vs recurring events
- Program schedules
- Contact information

### 4. Gallery
- Grid layout
- Full-screen image viewer
- Image titles
- Swipe to close

### 5. Broadcast
- YouTube/Facebook video embeds
- Broadcast schedule info
- Auto-play support

### 6. About & Contact
- Organization info
- Contact details with tap-to-call
- Tap-to-email
- Get directions to masjid
- Donations information

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### Clear Everything
```bash
rm -rf node_modules ios/Pods
npm install
cd ios && pod install && cd ..
```

## Performance Tips

1. **Images**: Images are loaded from your server. Optimize them for mobile (max 1200px width)
2. **Caching**: The app doesn't cache data - each screen refresh fetches fresh data
3. **Video**: Use optimized video embeds for better performance

## Support

For issues related to:
- **App functionality**: Check this README
- **API issues**: Check your server logs at `https://masjidaltaubah.co.za/api`
- **Content updates**: Use your web admin panel

## License

© 2024 Masjid Al Taubah. All rights reserved.
