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

   ℹ️ **What is a Key ID?**

   The **Key ID** (also known as the **"kid"** - Key Identifier) is a unique identifier for your Apple Sign-In private key. When your app authenticates users with Apple, it creates a digitally signed JSON Web Token (JWT) to prove its identity. This JWT contains:

   - **Header**: Includes the "kid" field so Apple knows which public key to use for verification
   - **Payload**: Contains your Team ID, Service ID, and authentication details
   - **Signature**: Created using your private key

   Think of it like a key ring with multiple keys - the Key ID tells Apple "use THIS specific key to verify my signature." Without the correct Key ID, Apple won't know which public key matches your private key, and authentication will fail.

   **Where to find your Key ID:**
   - When you created your key in Apple Developer Console (Part 1, Step 3.4)
   - You saw a 10-character alphanumeric code like `AB12CD34EF` or `XY9876ZABC`
   - This is displayed once when you download the `.p8` file
   - You can also see it anytime by going to: Apple Developer Console → Keys → Click on your key name

   **Important Notes:**
   - ✅ Must be EXACTLY 10 characters
   - ✅ Case-sensitive (uppercase letters and numbers)
   - ✅ Associated with your downloaded `.p8` private key file
   - ⚠️ If you enter the wrong Key ID, Apple Sign-In will fail with "Invalid client"

   ---

   **Private Key**: (from the .p8 file you downloaded)

   ℹ️ **What is a Private Key?**

   The **Private Key** is the secret cryptographic key that your app uses to prove its identity to Apple. It's stored in the `.p8` file you downloaded from Apple Developer Console.

   **How it works:**
   1. Your app creates a JWT (JSON Web Token) with authentication details
   2. Signs the JWT with this private key using the ES256 algorithm (Elliptic Curve Digital Signature Algorithm with SHA-256)
   3. Sends the signed JWT to Apple
   4. Apple uses the corresponding public key (which they have) to verify the signature
   5. If verification succeeds, Apple knows the request is genuinely from your app

   **Private vs Public Keys:**
   - 🔐 **Private Key** (what you're pasting): You keep this SECRET. Never share it publicly!
   - 🔓 **Public Key**: Apple keeps this. They use it to verify your signatures.
   - These are a mathematically linked pair - data signed with the private key can ONLY be verified with its corresponding public key

   **How to get your Private Key:**
   - Open the `.p8` file you downloaded in a text editor (Notepad, TextEdit, VS Code, etc.)
   - The filename looks like: `AuthKey_AB12CD34EF.p8` (where `AB12CD34EF` is your Key ID)
   - Copy the ENTIRE contents, including the BEGIN and END lines
   - Example format:
   ```
   -----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg
   5J9xPqGlKj3Hzx7Y2vN8mR4kT6wQ1eS3cA9pB7fD2iKgCgYI
   KoZIzj0DAQehRANCAAS8J2xYGKxPRkj5T9L3nB6vM8oQ2cF4
   6pR7sN1wK9jX8hY4eD2fG5bA3kT7mP9cL6xN8sE1jR4vB9wH
   ...more lines...
   -----END PRIVATE KEY-----
   ```
   - Paste it into the Private Key field in Firebase

   **Important Notes:**
   - ✅ Must include `-----BEGIN PRIVATE KEY-----` at the start
   - ✅ Must include `-----END PRIVATE KEY-----` at the end
   - ✅ Include ALL lines in between (don't truncate)
   - ✅ Preserve exact formatting (line breaks matter)
   - ⚠️ This file can ONLY be downloaded ONCE from Apple Developer Console
   - 🔐 **Security**: Store this file securely! Anyone with this key can impersonate your app
   - 🔐 Never commit the `.p8` file to version control (add `*.p8` to your `.gitignore`)
   - 🔐 Never share this key publicly or in screenshots

   **If you lost your .p8 file:**
   - You cannot re-download it from Apple
   - You must create a new key in Apple Developer Console
   - Go to Keys → + button → Create a new Sign in with Apple key
   - Download the new `.p8` file immediately and store it safely
   - Update Firebase with the new Key ID and Private Key

   ---

   **Authorization Callback URL**

   ℹ️ **What is this URL?**

   After a user signs in with Apple, Apple needs to redirect them back to your app. The **Authorization Callback URL** (also called OAuth Redirect URI) is the destination URL where Apple sends the user after authentication.

   **Your callback URL should be:**
   ```
   https://streaks-f084b.firebaseapp.com/__/auth/handler
   ```

   **Understanding the URL structure:**
   - `https://` - Must be HTTPS (required for security)
   - `streaks-f084b` - Your Firebase project ID
   - `.firebaseapp.com` - Firebase's hosting domain
   - `/__/auth/handler` - Firebase's authentication handler endpoint

   **Why this matters:**
   1. **User Experience**: After clicking "Sign in with Apple", users see Apple's login screen
   2. **Authentication**: User enters their Apple ID and password
   3. **Consent**: Apple shows what data will be shared (name, email)
   4. **Redirect**: Apple sends user back to this callback URL with an authentication token
   5. **Completion**: Firebase receives the token and signs the user into your app

   **What you need to do:**

   ✅ **Verify this URL matches Apple Developer Console:**
   - Go to: Apple Developer Console → Identifiers → Your Service ID (e.g., `com.yourname.streaks.web`)
   - Click on it → Configure Sign in with Apple
   - Under **"Return URLs"**, you should see this exact URL
   - If it doesn't match, update it in Apple Developer Console (from Part 1, Step 2.6)

   ✅ **Additional setup to verify your domain with Apple:**

   Apple requires you to prove you own the domain before allowing authentication. For Firebase hosting, this is automatically handled by Firebase. However, you may need to:

   1. **Verify domain ownership** (usually automatic with Firebase)
   2. **Add domain to Apple's allowlist** in your Service ID configuration
   3. **Test on HTTPS** - Apple Sign-In will NOT work on `http://localhost` in production mode
      - Exception: You can test locally using Firebase emulators or Vite preview on `localhost`

   📚 **Learn more:**
   - Apple's domain verification: https://developer.apple.com/help/account/configure-app-capabilities/configure-sign-in-with-apple-for-the-web
   - Firebase Auth domains: https://firebase.google.com/docs/auth/web/redirect-best-practices

   **Common issues with callback URLs:**
   - ❌ **Mismatch error**: "redirect_uri_mismatch" means the URL doesn't match what's in Apple Developer Console
   - ❌ **Not authorized**: Domain isn't added to Apple's allowed domains list
   - ❌ **Invalid domain**: Using HTTP instead of HTTPS
   - ❌ **Wrong URL format**: Missing `/__/auth/handler` endpoint

   **If you deploy to a custom domain:**
   - You'll need to add your custom domain (e.g., `https://streaks.yourdomain.com`) to:
     1. Firebase Console → Authentication → Settings → Authorized domains
     2. Apple Developer Console → Service ID → Return URLs
     3. Both locations must match exactly

   ---

7. **Save**
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
