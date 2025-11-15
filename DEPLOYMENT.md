# Free Deployment Options

Your Streaks app can be deployed for FREE to any of these platforms:

## Option 1: Netlify (Recommended - Easiest)

1. Go to https://www.netlify.com/
2. Sign up with GitHub (free account)
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Netlify will auto-detect settings from `netlify.toml`
6. Click "Deploy"
7. Your app will be live at: `https://your-app.netlify.app`

**No configuration needed** - I've already added `netlify.toml`

## Option 2: Vercel (Also Great)

1. Go to https://vercel.com/
2. Sign up with GitHub (free account)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect settings from `vercel.json`
6. Click "Deploy"
7. Your app will be live at: `https://your-app.vercel.app`

**No configuration needed** - I've already added `vercel.json`

## Option 3: GitHub Pages (Free, GitHub Native)

1. Go to your GitHub repository settings
2. Click "Pages" in the left sidebar
3. Source: "GitHub Actions"
4. I've created the workflow file for you
5. Push code to main branch
6. App will be live at: `https://yourusername.github.io/streaks/`

## Option 4: Run Locally

1. Download and unzip `streaks-app-dist.zip`
2. Double-click `dist/index.html`
3. Works instantly in any browser, fully offline!

## Recommended: Netlify or Vercel

Both are:
- ✅ **100% FREE** for personal projects
- ✅ **Automatic HTTPS**
- ✅ **Global CDN** (fast worldwide)
- ✅ **Auto-deploy** on git push
- ✅ **Custom domains** supported
- ✅ **PWA support** built-in

Just push your code to GitHub, then connect it to Netlify or Vercel. Your app will be live in 2 minutes with a public URL you can access from your iPhone!

## After Deployment

Once deployed, you can:
1. Access the URL from your iPhone Safari
2. Tap Share → "Add to Home Screen"
3. Use it like a native app!

All your data stays on your device with localStorage.
