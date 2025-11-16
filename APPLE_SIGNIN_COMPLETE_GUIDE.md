# Complete Apple Sign-In Setup Guide

## Prerequisites
- ✅ Apple Developer Account ($99/year) - You have this!
- ✅ Firebase project created - You have this (streaks-f084b)

---

## Part 1: Apple Developer Console Setup

### Step 1: Create an App ID

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account
   - Sign in with your Apple ID that has the developer account

2. **Navigate to Identifiers**
   - Click "Certificates, Identifiers & Profiles" (left sidebar)
   - Click "Identifiers"
   - Click the **blue (+) button** in the top left

3. **Register a New Identifier**
   - Select **"App IDs"**
   - Click **Continue**

4. **Select Type**
   - Select **"App"**
   - Click **Continue**

5. **Configure Your App ID**
   - **Description**: `Streaks Habit Tracker`
   - **Bundle ID**: Select "Explicit"
   - **Bundle ID field**: Enter something like: `com.yourname.streaks`
     - Example: `com.ebbe.streaks` or `com.yourdomain.streaks`
     - ⚠️ **IMPORTANT**: Write this down! You'll need it later
     - This must be unique and can't be changed later

6. **Enable Sign in with Apple**
   - Scroll down to "Capabilities"
   - Find **"Sign In with Apple"**
   - ✅ **Check this box**
   - Click **Continue**

7. **Register**
   - Review your settings
   - Click **Register**
   - ✅ **Your App ID is created!**

---

### Step 2: Create a Services ID

1. **Create New Identifier**
   - Still in "Identifiers" page
   - Click the **blue (+) button** again

2. **Select Services ID**
   - Select **"Services IDs"**
   - Click **Continue**

3. **Configure Services ID**
   - **Description**: `Streaks Web Auth`
   - **Identifier**: Enter something like: `com.yourname.streaks.web`
     - Example: `com.ebbe.streaks.web`
     - ⚠️ **IMPORTANT**: This must be DIFFERENT from your App ID
     - Write this down as your **Service ID**
   - Click **Continue**

4. **Register**
   - Click **Register**

5. **Configure the Service ID**
   - You'll see your new Service ID in the list
   - **Click on it** to configure it
   - ✅ Check **"Sign In with Apple"**
   - Click **Configure** (next to Sign In with Apple)

6. **Configure Web Authentication**
   - **Primary App ID**: Select the App ID you created in Step 1 (e.g., `com.yourname.streaks`)
   - **Domains and Subdomains**:
     - Add: `streaks-f084b.firebaseapp.com`
   - **Return URLs**:
     - Add: `https://streaks-f084b.firebaseapp.com/__/auth/handler`
   - Click **Next**
   - Click **Done**
   - Click **Continue**
   - Click **Save**

---

### Step 3: Create a Sign in with Apple Key

1. **Navigate to Keys**
   - In the left sidebar, click **"Keys"**
   - Click the **blue (+) button**

2. **Register a New Key**
   - **Key Name**: `Streaks Apple Sign In Key`
   - ✅ Check **"Sign In with Apple"**
   - Click **Configure** (next to Sign In with Apple)

3. **Configure Key**
   - **Primary App ID**: Select your App ID (e.g., `com.yourname.streaks`)
   - Click **Save**
   - Click **Continue**

4. **Register and Download**
   - Click **Register**
   - ⚠️ **CRITICAL**: You'll see a download page
   - Click **Download** to save the `.p8` file
   - ⚠️ **YOU CAN ONLY DOWNLOAD THIS ONCE!** Save it somewhere safe!
   - **Key ID**: You'll see a 10-character Key ID (like: `AB12CD34EF`)
   - ⚠️ **Write down this Key ID!**
   - Click **Done**

5. **Get Your Team ID**
   - In the top right corner of the Apple Developer page
   - Next to your name, you'll see your **Team ID** (10 characters)
   - Example: `XYZ1234567`
   - ⚠️ **Write down your Team ID!**

---

## Part 2: Firebase Console Setup

### Step 1: Enable Firestore Database

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Click on your **"streaks-f084b"** project

2. **Create Firestore Database**
   - In the left sidebar, click **"Firestore Database"**
   - Click **"Create database"**
   - Select **"Start in production mode"**
   - Click **Next**
   - Choose a location (select closest to you, e.g., `us-central` or `europe-west`)
   - Click **Enable**
   - Wait for it to provision (30-60 seconds)

3. **Set Security Rules**
   - Click the **"Rules"** tab at the top
   - Replace ALL the content with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

   - Click **Publish**
   - ✅ **Firestore is ready!**

---

### Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click **"Get started"**

2. **Enable Anonymous Sign-In** (fallback)
   - Click on **"Anonymous"** in the provider list
   - Toggle it to **Enabled**
   - Click **Save**

3. **Enable Apple Sign-In**
   - Click on **"Apple"** in the provider list
   - Toggle it to **Enabled**

4. **Configure Apple Provider**
   - You'll see configuration fields. Fill them in:

   **Services ID**: (from Step 2 of Apple Developer setup)
   - Enter your Service ID (e.g., `com.yourname.streaks.web`)

   **Apple Team ID**: (from Step 3.5 of Apple Developer setup)
   - Enter your Team ID (10 characters, e.g., `XYZ1234567`)

   **Key ID**: (from Step 3.4 of Apple Developer setup)
   - Enter your Key ID (10 characters, e.g., `AB12CD34EF`)

   **Private Key**: (from the .p8 file you downloaded)
   - Open the `.p8` file you downloaded in a text editor
   - Copy the ENTIRE contents (including the BEGIN and END lines)
   - Example format:
   ```
   -----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
   ...more lines...
   -----END PRIVATE KEY-----
   ```
   - Paste it into the Private Key field

5. **Get OAuth Redirect URI**
   - Before clicking Save, you'll see a field labeled **"OAuth redirect URI"**
   - Copy this URL (it should be: `https://streaks-f084b.firebaseapp.com/__/auth/handler`)
   - ⚠️ Make sure this matches what you entered in Apple Developer Console Step 2.6
   - If different, go back to Apple Developer Console and update it

6. **Save**
   - Click **Save**
   - ✅ **Apple Sign-In is configured in Firebase!**

---

## Part 3: Verify Setup

### Summary of What You Should Have:

From **Apple Developer Console**:
- ✅ App ID: `com.yourname.streaks` (with Sign in with Apple enabled)
- ✅ Service ID: `com.yourname.streaks.web` (configured with Firebase domain)
- ✅ Key: Downloaded `.p8` file and Key ID
- ✅ Team ID: 10-character code

From **Firebase Console**:
- ✅ Firestore Database: Enabled with security rules
- ✅ Authentication: Anonymous enabled
- ✅ Authentication: Apple enabled with all credentials

---

## Part 4: Test Your Setup

1. **Rebuild your app**:
   ```bash
   cd /home/user/streaks
   npm run build
   npm run preview
   ```

2. **Test Apple Sign-In**:
   - Open the preview URL
   - Click "Sign in with Apple"
   - You should see the Apple Sign-In popup
   - Sign in with your Apple ID
   - First time: Apple will ask permission
   - You should be signed in and see your character!

3. **Test Cross-Device Sync**:
   - Sign in on one device
   - Create some tasks
   - Sign in on another device with the same Apple ID
   - Your tasks should appear!

---

## Troubleshooting

### "Invalid client" error
- Check that your Service ID in Firebase matches exactly what you created in Apple Developer Console
- Make sure you configured the Service ID with the correct redirect URL

### "Invalid key" error
- Make sure you copied the ENTIRE `.p8` file contents including BEGIN and END lines
- Check that your Key ID is correct (10 characters)

### "Invalid team" error
- Verify your Team ID is correct (found in top right of Apple Developer Console)

### Sign-in popup doesn't appear
- Check browser console for errors
- Make sure you're testing on HTTPS or localhost
- Apple Sign-In doesn't work on HTTP

---

## Need Help?

If you get stuck at any step, tell me:
1. Which step you're on
2. What you see on screen
3. Any error messages

I'll help you through it!
