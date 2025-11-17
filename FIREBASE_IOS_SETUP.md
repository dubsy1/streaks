# Firebase iOS Setup Guide - Enable Apple Sign-In & Cloud Sync

This guide will configure Firebase for your iOS app to enable Apple Sign-In and automatic cloud sync across all devices.

## Prerequisites
- Firebase project already created (streaks-f084b)
- Xcode installed on Mac
- Apple Developer Account

---

## Step 1: Add iOS App to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **streaks-f084b**
3. Click the **iOS icon** to add an iOS app
4. Register your app:
   - **iOS bundle ID**: `com.ebbe.streaksapp` (or whatever you set in Xcode)
   - **App nickname**: Streaks
   - **App Store ID**: (leave blank for now)
5. Click **Register app**

---

## Step 2: Download GoogleService-Info.plist

1. After registering, Firebase will show a **Download GoogleService-Info.plist** button
2. Click **Download GoogleService-Info.plist**
3. Save the file to your Mac

---

## Step 3: Add GoogleService-Info.plist to Xcode

1. Open Xcode:
   ```bash
   open ~/Desktop/streaks/ios/App/App.xcworkspace
   ```

2. In Xcode, **drag and drop** `GoogleService-Info.plist` into the **App** folder (left sidebar)
   - Make sure **"Copy items if needed"** is checked
   - Make sure **"App"** target is selected
   - Click **Finish**

3. Verify it's added:
   - Left sidebar → **App** folder → You should see `GoogleService-Info.plist`

---

## Step 4: Add Firebase SDK to iOS (via CocoaPods)

1. Open **Terminal** on your Mac

2. Navigate to the iOS project:
   ```bash
   cd ~/Desktop/streaks/ios/App
   ```

3. Edit the `Podfile`:
   ```bash
   nano Podfile
   ```

4. Add Firebase pods **after** the `platform :ios` line:
   ```ruby
   platform :ios, '13.0'
   use_frameworks!

   # Firebase pods
   pod 'Firebase/Auth'
   pod 'Firebase/Firestore'

   target 'App' do
     capacitor_pods
     # Add your Pods here
   end
   ```

5. Save and exit (Ctrl+X, then Y, then Enter)

6. Install the pods:
   ```bash
   pod install
   ```

   Wait for it to complete (1-2 minutes)

---

## Step 5: Enable Apple Sign-In in Xcode

1. In Xcode, select **App** (blue icon) in the left sidebar

2. Go to **"Signing & Capabilities"** tab

3. Click **"+ Capability"** button (top left)

4. Search for **"Sign in with Apple"**

5. Double-click to add it

6. You should now see **"Sign in with Apple"** in the capabilities list

---

## Step 6: Enable Apple Sign-In in Firebase Console

1. Go back to [Firebase Console](https://console.firebase.google.com)

2. Select your project: **streaks-f084b**

3. Go to **Authentication** → **Sign-in method**

4. Click on **Apple**

5. Click **Enable**

6. You'll need to add your **Service ID** and **Team ID**:
   - **Team ID**: Find this in [Apple Developer Account](https://developer.apple.com/account/) → Membership
   - **Service ID**: Create one in Apple Developer:
     1. Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
     2. Click **+** to create new **Service ID**
     3. Description: `Streaks Auth`
     4. Identifier: `com.ebbe.streaksapp.auth`
     5. Click **Continue** → **Register**

7. Back in Firebase, enter:
   - **Team ID**: (from Apple Developer)
   - **Service ID**: `com.ebbe.streaksapp.auth`

8. Click **Save**

---

## Step 7: Configure Firebase in iOS (AppDelegate)

The Capacitor framework handles Firebase initialization automatically, but we need to ensure it's configured.

1. In Xcode, open `App/AppDelegate.swift`

2. At the top, add the import:
   ```swift
   import Firebase
   ```

3. In the `application(_ application: UIApplication, didFinishLaunchingWithOptions...)` method, add **at the very beginning**:
   ```swift
   FirebaseApp.configure()
   ```

   It should look like:
   ```swift
   func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
       FirebaseApp.configure() // Add this line

       // ... rest of the code
   }
   ```

4. Save the file (Cmd+S)

---

## Step 8: Build and Test

1. In Xcode, select **iPhone 15 Pro** (or any simulator) from the device dropdown

2. Click **▶️ Play** button (or press Cmd+R)

3. The app should build and launch

4. You should see the **login screen** with **"Sign in with Apple"** button

5. Click the button:
   - First time: It will prompt you to sign in with your Apple ID
   - Subsequent times: It will auto-sign in

6. After signing in:
   - You'll see the onboarding screen (if first time)
   - Then the main app

---

## Step 9: Test Cloud Sync

### On iPhone Simulator:
1. Sign in with Apple
2. Complete onboarding
3. Create a habit (e.g., "Drink water")
4. Complete it (earn XP + Gold)

### On iPad Simulator (or another device):
1. In Xcode, change device to **iPad Pro** (or iPad Air)
2. Run the app again (Cmd+R)
3. Sign in with the **same Apple ID**
4. **Your habit should appear!** ✅
5. Your XP, Gold, Level should all match!

**This proves cloud sync is working!** 🎉

---

## Troubleshooting

### "Firebase not configured" error:
- Make sure `GoogleService-Info.plist` is in the Xcode project
- Make sure `FirebaseApp.configure()` is called in AppDelegate
- Clean build folder (Cmd+Shift+K) and rebuild

### "Apple Sign-In failed" error:
- Make sure "Sign in with Apple" capability is added in Xcode
- Make sure Apple provider is enabled in Firebase Console
- Check that Bundle ID matches in Firebase and Xcode

### "No such module 'Firebase'" error:
- Run `pod install` in Terminal (in the ios/App directory)
- Close and reopen Xcode
- Clean build folder and rebuild

### Data not syncing:
- Check Firebase Console → Firestore Database → You should see collections: `users`
- Check the user ID matches across devices (Firebase Console → Authentication → Users)
- Make sure you're signed in with the same Apple ID on both devices

---

## What Data Syncs?

### ✅ Synced Across Devices:
- All habits, dailies, and to-dos
- Your stats (Level, XP, Health, Gold)
- Owned hats and equipped hat
- Task completion history
- Streaks

### ❌ Not Synced:
- Onboarding completion status (localStorage only)
- Filter selections (localStorage only)
- Current view tab (localStorage only)

---

## Next Steps

Once everything works:
1. Test on a real iPhone (connect via USB)
2. Remove the onboarding screen requirement if needed
3. Submit to App Store!

The cloud sync is now fully functional. Users can switch between iPhone, iPad, and Mac, and all their data will sync automatically! 🚀
