# iOS App Store Deployment Guide

Your Streaks app is now ready to be submitted to the Apple App Store! Here's how to proceed:

## Current Status

✅ **PWA Ready** - App can be installed on iPhone via Safari
✅ **Capacitor iOS** - Native iOS project created
✅ **Offline Support** - Service worker for offline functionality
✅ **iOS Optimized** - iOS-specific meta tags and icons added

## Option 1: Progressive Web App (Quick & Free)

Your app is already installable on iPhone as a PWA:

### How to Install on iPhone:
1. Open **http://21.0.0.164:4173/** in Safari on your iPhone
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app will appear on your home screen like a native app!

**Benefits:**
- No App Store submission required
- No $99/year Apple Developer fee
- Instant updates (just rebuild and redeploy)
- Works offline
- Looks and feels like a native app

**Limitations:**
- Not discoverable in App Store
- No access to some native iOS features (push notifications, in-app purchases, etc.)
- Users must find it via web link

## Option 2: Native iOS App Store Submission

For full App Store distribution with all native features:

### Prerequisites:
1. **Mac computer** with Xcode installed
2. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
3. **CocoaPods** installed (for iOS dependencies)
   ```bash
   sudo gem install cocoapods
   ```

### Steps to Build for App Store:

#### 1. Sync iOS Project
```bash
npm run ios:build
```

#### 2. Open Xcode Project
```bash
npm run ios:open
```

Or manually open: `/home/user/streaks/ios/App/App.xcworkspace`

#### 3. Configure in Xcode

**In Xcode:**
- Select the project in the left sidebar
- Under "Signing & Capabilities":
  - Select your Team (Apple Developer account)
  - Change Bundle Identifier if needed (currently: `com.streaks.app`)
- Under "General":
  - Set Display Name: "Streaks"
  - Set Version: 1.0.0
  - Add app icons (512x512, 1024x1024, etc.)

#### 4. Add App Icons

Create proper PNG icons at these sizes:
- 20×20, 29×29, 40×40, 60×60, 76×76, 83.5×83.5, 1024×1024

Tools to generate icons:
- https://appicon.co/
- https://www.appicon.build/
- Figma/Sketch/Photoshop

Place icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

#### 5. Test on Device
- Connect your iPhone to your Mac
- Select your device in Xcode
- Click the ▶️ Play button to build and run

#### 6. Build for App Store
1. In Xcode, select **Product** → **Archive**
2. Once archived, click **Distribute App**
3. Choose **App Store Connect**
4. Follow the wizard to upload to App Store Connect

#### 7. Submit via App Store Connect
1. Go to https://appstoreconnect.apple.com/
2. Create a new app listing
3. Fill in app details:
   - Name: Streaks
   - Category: Productivity or Health & Fitness
   - Description: "Track your habits, build streaks, and level up your life!"
   - Screenshots (required for different iPhone sizes)
   - Privacy policy URL (required)
4. Select your uploaded build
5. Submit for review

### Privacy Policy Requirement

Apple requires a privacy policy. Since your app only stores data locally:

**Sample Privacy Policy:**
```
Privacy Policy for Streaks

Data Storage:
All your data (tasks, streaks, stats) is stored locally on your device only.
We do not collect, transmit, or store any personal information on external servers.

Your data never leaves your device and is not shared with any third parties.
```

Host this on a simple webpage (GitHub Pages, your website, etc.) and provide the URL.

## Updating the App

### For PWA:
1. Make changes to code
2. Run `npm run build`
3. Deploy the new `dist/` folder
4. Users get updates automatically next time they open the app

### For App Store:
1. Make changes to code
2. Run `npm run ios:build`
3. Open in Xcode: `npm run ios:open`
4. Increment version number
5. Archive and submit to App Store Connect
6. Wait for Apple review (typically 1-3 days)

## Cost Comparison

| Aspect | PWA | App Store |
|--------|-----|-----------|
| Setup Cost | Free | $99/year |
| Distribution | Web link | App Store |
| Updates | Instant | Review required |
| Discovery | Manual sharing | App Store search |
| Native Features | Limited | Full access |
| Installation | Add to Home | App Store download |

## Recommended Approach

**Start with PWA:**
1. Share web link with users
2. Get feedback and iterate quickly
3. Build user base

**Move to App Store when:**
- You have proven demand
- Need push notifications or other native features
- Want App Store discoverability
- Ready to invest $99/year

## Need Native Features?

If you need features only available in native apps, you can add Capacitor plugins:

```bash
# Push Notifications
npm install @capacitor/push-notifications

# Local Notifications
npm install @capacitor/local-notifications

# Haptics (vibration)
npm install @capacitor/haptics

# And many more...
```

See: https://capacitorjs.com/docs/plugins

## Resources

- **Capacitor Docs**: https://capacitorjs.com/docs/ios
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Icon Generator**: https://appicon.co/

## Questions?

The iOS project is in the `/home/user/streaks/ios/` folder. All the configuration is in `capacitor.config.ts`.

**Currently accessible at:** http://21.0.0.164:4173/
Try it on your iPhone now as a PWA!
