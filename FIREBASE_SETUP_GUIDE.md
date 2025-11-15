# Firebase Setup Guide - Apple Sign-In & Cloud Sync

Your Streaks app now supports **Sign in with Apple** and **cloud syncing** across all devices!

## 🚀 Quick Overview

- **Sign in with Apple**: Users can sign in with their Apple ID
- **Cloud Sync**: All data automatically syncs across devices
- **Guest Mode**: Continue without account (data stays on device)
- **Automatic Migration**: Local data migrates to cloud on first sign-in

## 📋 Prerequisites

1. **Apple Developer Account** ($99/year) - Required for Sign in with Apple
2. **Firebase Account** (Free tier works great)
3. **Domain** for your app (can use provided Firebase domain)

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "Streaks" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Register Your App

1. In Firebase console, click the **web icon** (</>)
2. Register app nickname: "Streaks Web App"
3. **Check** "Also set up Firebase Hosting"
4. Click "Register app"
5. **Copy the configuration object** - you'll need this!

### Step 3: Enable Firestore Database

1. In Firebase console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select "Start in **production mode**"
4. Choose a location (closest to your users)
5. Click "Enable"

### Step 4: Set Firestore Security Rules

In Firestore Database → **Rules**, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

### Step 5: Enable Authentication

1. Go to **Build** → **Authentication**
2. Click "Get started"
3. Click **"Sign-in method"** tab
4. Enable **"Apple"**:
   - You'll need to configure this with Apple later
   - Leave it for now, we'll come back
5. Enable **"Anonymous"** (for guest mode):
   - Click "Anonymous"
   - Toggle "Enable"
   - Click "Save"

## 🍎 Apple Developer Setup

### Step 1: Create App ID

1. Go to https://developer.apple.com/account/
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** button
4. Select "App IDs" → Continue
5. Select "App" → Continue
6. Configure:
   - Description: "Streaks App"
   - Bundle ID: `com.streaks.app` (or your custom one)
   - **Check "Sign in with Apple"**
7. Click "Continue" → "Register"

### Step 2: Create Service ID

1. In Identifiers, click **+** again
2. Select "Services IDs" → Continue
3. Configure:
   - Description: "Streaks Web App"
   - Identifier: `com.streaks.app.web`
4. Click "Continue" → "Register"
5. **Click on the Service ID** you just created
6. **Check "Sign in with Apple"**
7. Click "Configure" next to it
8. Configure domains:
   - **Primary App ID**: Select your App ID
   - **Domains and Subdomains**: Add your Firebase Auth domain
     - Find this in Firebase: Authentication → Settings → Authorized domains
     - Example: `streaks-app-xxxxx.firebaseapp.com`
   - **Return URLs**: Add Firebase OAuth redirect
     - Format: `https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/handler`
     - Example: `https://streaks-app-xxxxx.firebaseapp.com/__/auth/handler`
9. Click "Save" → "Continue" → "Register"

### Step 3: Create Key for Sign in with Apple

1. Go to **Keys** → **+** button
2. Key Name: "Sign in with Apple Key"
3. **Check "Sign in with Apple"**
4. Click "Configure"
5. Select your Primary App ID
6. Click "Save" → "Continue" → "Register"
7. **Download the .p8 key file** ⚠️ You can only download this once!
8. Note the **Key ID** (you'll need this)

### Step 4: Get Your Team ID

1. Go to https://developer.apple.com/account/
2. Look at the top right - you'll see "Team ID"
3. Copy this ID (you'll need it)

## 🔐 Connect Apple to Firebase

Now connect Apple Sign-In to your Firebase project:

1. Go back to **Firebase Console** → **Authentication** → **Sign-in method**
2. Click on **"Apple"**
3. Toggle "Enable"
4. Fill in:
   - **OAuth client ID**: Your Service ID (`com.streaks.app.web`)
   - **Team ID**: From Apple Developer
   - **Key ID**: From the key you created
   - **Private key**: Open the .p8 file, copy all contents
5. Click "Save"

## ⚙️ Configure Your App

### Update Firebase Config

Edit `/home/user/streaks/src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace with your actual values from Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

## 🧪 Testing

### Test Locally

```bash
npm run build
npm run preview
```

Open http://localhost:4173

### Test Sign In

1. **Guest Mode**: Click "Continue as Guest"
   - Data saves locally only
   - Works immediately

2. **Apple Sign In**: Click "Sign in with Apple"
   - Redirects to Apple login
   - Returns to app after authentication
   - Data syncs to cloud

### Test Cross-Device Sync

1. Sign in with Apple on Device 1
2. Create some tasks, earn gold
3. Sign in with same Apple ID on Device 2
4. Your data should appear!

## 📱 Mobile Setup (iOS App)

To make Sign in with Apple work in your native iOS app:

### Update Capacitor Config

Edit `/home/user/streaks/capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.streaks.app', // Must match Apple App ID
  appName: 'Streaks',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'always'
  }
};
```

### In Xcode:

1. Open project: `npm run ios:open`
2. Select project in left sidebar
3. Select your app target
4. Go to **Signing & Capabilities**
5. Click **+ Capability**
6. Add **"Sign in with Apple"**
7. Build and run!

## 🔒 Security Best Practices

### Firestore Rules

The rules we set allow users to only access their own data:

```javascript
// Only the user can read/write their own data
allow read, write: if request.auth != null && request.auth.uid == userId;
```

### Never Commit Secrets

Add to `.gitignore`:
```
# Firebase
.firebase/
firebase-debug.log
firestore-debug.log

# Apple Keys
*.p8
AuthKey_*.p8
```

## 📊 Monitor Usage

### Firebase Console

- **Authentication** → **Users**: See who's signed in
- **Firestore** → **Data**: View user data (for debugging)
- **Usage**: Monitor reads/writes (stay within free tier)

### Free Tier Limits

Firebase Free Tier (Spark Plan):
- **Authentication**: Unlimited
- **Firestore Reads**: 50,000/day
- **Firestore Writes**: 20,000/day
- **Firestore Storage**: 1 GB

Perfect for personal use and small apps!

## 🐛 Troubleshooting

### "auth/popup-blocked"
- Enable popups for your domain
- Or use redirect instead of popup (requires code change)

### "auth/unauthorized-domain"
- Add your domain to Firebase: Authentication → Settings → Authorized domains
- Add: `localhost`, your Netlify domain, etc.

### Data Not Syncing
- Check browser console for errors
- Verify Firestore rules are correct
- Ensure user is authenticated

### Apple Sign-In Button Doesn't Work
- Check Service ID configuration
- Verify return URLs match exactly
- Ensure private key is correctly pasted

## 🚀 Deployment

### Deploy to Netlify/Vercel

1. Push code to GitHub
2. Connect to Netlify/Vercel
3. Add your production domain to:
   - Firebase Authorized domains
   - Apple Service ID Domains and Return URLs
4. Deploy!

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose your project
# Build directory: dist
# Single-page app: Yes
# GitHub actions: No (optional)

npm run build
firebase deploy
```

## 📖 Usage in Code

### Check if User is Signed In

```typescript
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Signed in:', user.uid);
  } else {
    console.log('Not signed in');
  }
});
```

### Save Data to Cloud

```typescript
import { saveTasksToCloud } from './utils/cloudSync';

await saveTasksToCloud(user, tasks);
```

### Load Data from Cloud

```typescript
import { loadTasksFromCloud } from './utils/cloudSync';

const tasks = await loadTasksFromCloud(user);
```

## ✅ Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Firestore security rules configured
- [ ] Anonymous auth enabled
- [ ] Apple Developer account active
- [ ] App ID created with Sign in with Apple
- [ ] Service ID created and configured
- [ ] Sign in with Apple key created
- [ ] Apple provider configured in Firebase
- [ ] Firebase config updated in code
- [ ] App tested locally
- [ ] Cross-device sync tested
- [ ] Production domains added to Firebase
- [ ] Production domains added to Apple Service ID

## 🎉 Done!

Your app now:
- ✅ Allows Sign in with Apple
- ✅ Syncs data across all devices
- ✅ Works offline with local storage fallback
- ✅ Migrates existing local data to cloud
- ✅ Supports guest mode

Users can now seamlessly switch between iPhone, iPad, Mac, and keep all their progress!

---

**Questions?** Check Firebase docs: https://firebase.google.com/docs
**Apple Sign-In docs:** https://developer.apple.com/sign-in-with-apple/
