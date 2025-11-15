# Quick Firebase Setup - Get Your API Key

Follow these steps to get your Firebase configuration code:

## Step 1: Create Firebase Project (2 minutes)

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/

2. **Click "Add project"** (or "Create a project")

3. **Enter project name**
   - Name: `Streaks` (or anything you want)
   - Click "Continue"

4. **Google Analytics**
   - Toggle OFF (you don't need it)
   - Click "Create project"

5. **Wait ~30 seconds** for project to be created
   - Click "Continue" when ready

## Step 2: Get Your Configuration (1 minute)

You're now in your Firebase project dashboard.

1. **Click the Web icon** `</>`
   - It's near the center: "Get started by adding Firebase to your app"
   - Or click the gear icon ⚙️ → "Project settings" → scroll down → "Your apps" → click `</>`

2. **Register your app**
   - App nickname: `Streaks Web App`
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy the configuration**

You'll see a code block that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "streaks-12345.firebaseapp.com",
  projectId: "streaks-12345",
  storageBucket: "streaks-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Copy this entire object!**

4. **Click "Continue to console"**

## Step 3: Update Your Code

Open this file: `/home/user/streaks/src/config/firebase.ts`

Replace the placeholder config with your real config:

**BEFORE (what you have now):**
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

**AFTER (paste your real values):**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // Your actual API key
  authDomain: "streaks-12345.firebaseapp.com",     // Your actual domain
  projectId: "streaks-12345",                       // Your actual project ID
  storageBucket: "streaks-12345.appspot.com",      // Your actual storage
  messagingSenderId: "123456789012",                // Your actual sender ID
  appId: "1:123456789012:web:abcdef1234567890"    // Your actual app ID
};
```

## Step 4: Enable Firestore Database

1. **In Firebase Console**, click "Firestore Database" in left menu
   - Or go to: Build → Firestore Database

2. **Click "Create database"**

3. **Choose location**
   - Production mode (recommended)
   - Select location closest to you (e.g., us-central1)
   - Click "Enable"

4. **Wait ~1 minute** for database to be created

5. **Set Security Rules**
   - Click "Rules" tab
   - Replace everything with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

   - Click "Publish"

## Step 5: Enable Authentication

1. **In Firebase Console**, click "Authentication" in left menu
   - Or go to: Build → Authentication

2. **Click "Get started"**

3. **Click "Sign-in method" tab**

4. **Enable Anonymous Authentication** (for Guest mode)
   - Click "Anonymous"
   - Toggle "Enable" ON
   - Click "Save"

5. **Enable Apple Sign-In** (optional for now, test with Guest first)
   - Click "Apple"
   - Toggle "Enable" ON
   - Leave Service ID and Team ID blank for now
   - Click "Save"

## Step 6: Test Your App!

Now rebuild and test:

```bash
cd /home/user/streaks
npm run build
npm run preview
```

Open http://localhost:4173

You should see the login screen!

Click **"Continue as Guest"** to test - it should work now!

## Visual Guide - Where to Find Config

### Finding Your Config Later:

If you need to find your config again:

1. Firebase Console → Click ⚙️ (gear icon) → "Project settings"
2. Scroll down to "Your apps"
3. You'll see your web app
4. Under "SDK setup and configuration" → "Config"
5. Copy the firebaseConfig object

## Example - Real Firebase Config

Here's what a real one looks like (with fake values):

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "streaks-app-abc123.firebaseapp.com",
  projectId: "streaks-app-abc123",
  storageBucket: "streaks-app-abc123.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

## ⚠️ Important Notes

- **Never commit your API key to public repos!** (It's okay for now since it's restricted to your domain)
- The apiKey is NOT a secret - it's safe to expose in your frontend
- Security comes from Firestore rules, not hiding the API key
- Test with "Continue as Guest" first before setting up Apple Sign-In

## Quick Checklist

- [ ] Created Firebase project
- [ ] Copied firebaseConfig object
- [ ] Updated `/home/user/streaks/src/config/firebase.ts`
- [ ] Enabled Firestore Database
- [ ] Set Firestore security rules
- [ ] Enabled Authentication (Anonymous)
- [ ] Rebuilt app: `npm run build`
- [ ] Tested: `npm run preview`
- [ ] Clicked "Continue as Guest" - it works!

## Troubleshooting

**Still getting API key error?**
- Make sure you saved the file
- Rebuild: `npm run build`
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

**Can't find the config?**
- Firebase Console → ⚙️ → Project settings → Scroll to "Your apps" → Config

**Guest mode not working?**
- Check Authentication is enabled
- Check Anonymous provider is enabled
- Check browser console for errors

---

**That's it!** Once you update the config file, Guest mode will work immediately. Apple Sign-In requires additional setup (see FIREBASE_SETUP_GUIDE.md), but you can test everything with Guest mode first! 🚀
