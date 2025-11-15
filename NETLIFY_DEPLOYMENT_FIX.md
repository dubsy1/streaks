# Netlify Deployment Fix Guide

## What I Fixed

The white screen issue on Netlify has been addressed with several improvements:

### 1. Error Boundary Added
- Catches React errors and displays them instead of white screen
- Shows error message and provides reload button
- Helps identify what's breaking in production

### 2. Backward Compatibility
- Handles users with old localStorage data
- Safely migrates data to new format with hat fields
- Prevents crashes from missing fields

### 3. SPA Routing Fixed
- Added `_redirects` file for proper routing
- Ensures all URLs work correctly
- Already configured in `netlify.toml`

### 4. Error Logging
- Added console logging for debugging
- Easier to identify issues in browser console

## How to Deploy to Netlify

### Option 1: Push to GitHub (Automatic)

1. **Push this code to your GitHub repository**
2. **Netlify will auto-deploy** (if connected)
3. **Wait 2-3 minutes** for build to complete

### Option 2: Manual Deploy

1. **Build locally:**
   ```bash
   cd /home/user/streaks
   npm run build
   ```

2. **Drag & drop the `dist` folder** to Netlify:
   - Go to https://app.netlify.com
   - Click "Sites"
   - Drag the `/home/user/streaks/dist` folder to deploy

## Debugging the White Screen

If you still see a white screen after deploying:

### 1. Check Browser Console

1. Open the deployed site
2. Press `F12` or `Cmd+Option+I` (Mac)
3. Click "Console" tab
4. Look for red error messages
5. Share the errors with me if you see any

### 2. Check Netlify Build Logs

1. Go to https://app.netlify.com
2. Click your site
3. Click "Deploys"
4. Click the latest deploy
5. Scroll through build logs for errors

### 3. Test Locally First

Before deploying, test the production build locally:

```bash
# Build
npm run build

# Test the build
npm run preview

# Open http://localhost:4173 in your browser
```

If it works locally but not on Netlify, it's likely a deployment configuration issue.

## Common Issues & Solutions

### Issue: "Failed to load module"
**Solution:** Make sure all imports use correct file extensions (.tsx, .ts)

### Issue: Assets not loading (images, CSS)
**Solution:** Check that all asset paths start with `/` not `./`
```javascript
// Good
<img src="/character.png" />

// Bad
<img src="./character.png" />
```

### Issue: 404 on page refresh
**Solution:** Already fixed with `_redirects` file and `netlify.toml`

### Issue: localStorage errors
**Solution:** Already fixed with backward compatibility in `storage.ts`

## What to Check in Browser Console

Once deployed, open browser console and look for:

### ✅ Good Signs:
```
Service Worker registration failed: [expected - we disabled it]
```

### ❌ Bad Signs:
```
Uncaught TypeError: ...
Failed to fetch ...
Cannot read property ... of undefined
```

If you see bad signs, copy the full error message and I can help debug!

## Quick Test Checklist

After deploying, test these features:

- [ ] Site loads (not white screen)
- [ ] Can add a task
- [ ] Can complete a task
- [ ] Can navigate to Character tab
- [ ] Can navigate to Shop tab
- [ ] Can navigate to Inventory tab
- [ ] Stats bar shows correctly
- [ ] Gold increases when completing tasks

## If Still Broken

1. **Check the error** in browser console
2. **Try clearing cache** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
3. **Try incognito mode** to rule out extensions/cache
4. **Check if it works locally** with `npm run preview`
5. **Share the error message** with me

## Environment Differences

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | http://localhost:5173 | `npm run dev` - Hot reload |
| Production Preview | http://localhost:4173 | `npm run preview` - Test build |
| Netlify | https://your-app.netlify.app | Live deployment |

## Netlify Configuration Files

These files control the deployment:

```
netlify.toml          - Build settings and redirects
public/_redirects     - SPA routing rules
```

Both are already configured correctly!

## Next Steps

1. **Deploy to Netlify** (push to GitHub or manual drag/drop)
2. **Open the deployed URL** in your browser
3. **Open browser console** (F12) to check for errors
4. **Test the app** - try adding tasks, checking tabs
5. **If errors appear**, send me the console output

The fixes I added should resolve the white screen. If you still see it, the ErrorBoundary will show the actual error message instead of a blank screen!

---

**Need help?** Share:
- Deployed URL
- Browser console errors (if any)
- Whether it works locally with `npm run preview`
