# iOS App Store Submission Guide

## ✅ Your App is Ready!

Your Streaks app has been built and is ready to submit to the App Store.

---

## 🚀 Quick Start (On Your MacBook)

### 1. Open in Xcode
```bash
cd ~/path/to/streaks
open ios/App/App.xcworkspace
```
⚠️ Open `.xcworkspace` NOT `.xcodeproj`!

### 2. Configure in Xcode
- Select "App" target
- Change Bundle ID to: `com.yourname.streaks`
- Select your Apple Developer Team
- Add "Sign in with Apple" capability

### 3. Build & Test
- Select iPhone simulator (top-left)
- Click ▶️ Play button
- Test the app!

### 4. Archive for App Store
- Select "Any iOS Device" (top-left)
- Product → Archive
- Wait for build (2-5 min)
- Click "Distribute App" → "App Store Connect" → "Upload"

### 5. Submit in App Store Connect
- Go to https://appstoreconnect.apple.com/
- Create new app
- Upload screenshots & info
- Select your build
- Submit for review!

---

## 📱 What You Need

### Before You Start:
✅ Apple Developer Account ($99/year)
✅ MacBook with Xcode installed
✅ Firebase configured (already done!)
✅ App icons (already included!)

### For App Store Listing:
- App description
- Screenshots (6.7" and 5.5" required)
- Keywords
- Privacy Policy URL
- Support URL

---

## 🎯 App Store Connect Setup

1. **Create App**:
   - Platform: iOS
   - Name: Streaks  
   - Bundle ID: com.yourname.streaks (must match Xcode!)
   - SKU: streaks-001

2. **Category**: Productivity / Health & Fitness

3. **Screenshots**: Take from iOS simulator or real device

4. **Privacy Policy**: Required! Can use a simple template

---

## ⚡ Quick Commands

```bash
# Build web app
npm run build

# Sync to iOS  
npx cap sync ios

# Open in Xcode
npx cap open ios
```

---

## 🐛 Common Issues

**"No development team"**
→ Select your team in Signing & Capabilities

**"Sign in with Apple not working"**
→ Add capability in Xcode + configure in Firebase

**Build errors**
→ Product → Clean Build Folder (Cmd+Shift+K)

---

## 📊 After Approval (24-48 hours)

- App goes live on App Store
- Monitor reviews & downloads
- Plan updates!

**Good luck! 🚀**
