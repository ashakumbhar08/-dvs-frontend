# Vercel Deployment Troubleshooting

**Error:** "Error: forbidden"  
**Date:** April 29, 2026

---

## 🔍 Problem

Vercel deployment showing "Error: forbidden" message.

---

## ✅ Solutions (Try in Order)

### Solution 1: Fix Environment Variables ⭐ MOST COMMON

**Problem:** Missing or incorrect environment variables

**Steps:**

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `dvs-frontend-v8a9`
3. Click **Settings** → **Environment Variables**
4. Add/Update these variables:

```env
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CERTIFICATE_CONTRACT_ID=CDAE4RN4PVDR2HEQNMQFMQLROPV32UQ4M2VVDXV2EAAUB6U7CZV74AE2
VITE_REWARD_CONTRACT_ID=CBNIXG7UUYJBXRHTCMEJNOTQBLN7CJQ3QMIV6BUVBSTCWAY7VXXDHJ4C
VITE_ENABLE_DEMO_MODE=false
```

5. Make sure to select **Production**, **Preview**, and **Development** for each variable
6. Click **Save**
7. Go to **Deployments** tab
8. Click the **⋯** menu on the latest deployment
9. Click **Redeploy**

---

### Solution 2: Verify Build Settings

**Problem:** Incorrect build configuration

**Steps:**

1. Go to **Settings** → **General**
2. Verify these settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 20.x |

3. If any are wrong, update them
4. Click **Save**
5. Redeploy

---

### Solution 3: Check Repository Permissions

**Problem:** Vercel doesn't have access to your repository

**Steps:**

1. Go to **Settings** → **Git**
2. Verify the repository is connected: `ashakumbhar08/-dvs-frontend`
3. If disconnected:
   - Click **Connect Git Repository**
   - Authorize Vercel to access your GitHub account
   - Select the repository
4. Redeploy

---

### Solution 4: Clear Build Cache

**Problem:** Cached build causing issues

**Steps:**

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** → **UNCHECK IT**
5. Click **Redeploy**

---

### Solution 5: Check for Build Errors

**Problem:** Build failing but error not shown

**Steps:**

1. Go to **Deployments** tab
2. Click on the failing deployment
3. Click **Building** or **Build Logs**
4. Look for error messages
5. Common errors:
   - `Module not found` → Missing dependency
   - `Out of memory` → Build too large
   - `Command failed` → Build script error

---

### Solution 6: Verify Package.json

**Problem:** Missing or incorrect scripts

**Current package.json scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

✅ **These are correct** - No changes needed

---

### Solution 7: Test Build Locally

**Problem:** Build works on Vercel but fails locally (or vice versa)

**Steps:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# Test preview
npm run preview
```

**Expected output:**
```
✓ built in 997ms
dist/index.html                   0.56 kB
dist/assets/index-DcJaLrsu.css   34.87 kB
dist/assets/index-49gyUIRH.js   349.59 kB
```

✅ **Local build works** - Issue is Vercel-specific

---

### Solution 8: Check Vercel Status

**Problem:** Vercel platform issues

**Steps:**

1. Visit: https://www.vercel-status.com
2. Check if there are any ongoing incidents
3. If yes, wait for resolution
4. If no, continue troubleshooting

---

### Solution 9: Reconnect GitHub Integration

**Problem:** GitHub integration broken

**Steps:**

1. Go to **Settings** → **Git**
2. Click **Disconnect**
3. Confirm disconnection
4. Click **Connect Git Repository**
5. Select GitHub
6. Authorize Vercel
7. Select repository: `ashakumbhar08/-dvs-frontend`
8. Click **Connect**
9. Redeploy

---

### Solution 10: Create New Deployment

**Problem:** Deployment stuck in bad state

**Steps:**

1. Go to **Deployments** tab
2. Find a successful deployment (if any)
3. Click **⋯** → **Promote to Production**
4. OR trigger new deployment:
   ```bash
   git commit --allow-empty -m "trigger: redeploy"
   git push origin main
   ```

---

## 🔍 Debugging Steps

### Check Deployment Logs

1. Go to Vercel dashboard
2. Click on the failing deployment
3. Check these tabs:
   - **Building** - Build logs
   - **Functions** - Function logs
   - **Edge** - Edge function logs
   - **Static** - Static file logs

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Error: forbidden" | Missing env vars or permissions | Solution 1 or 3 |
| "Build failed" | Build script error | Solution 6 or 7 |
| "Out of memory" | Build too large | Optimize bundle size |
| "Module not found" | Missing dependency | `npm install` |
| "Command not found" | Wrong build command | Solution 2 |

---

## ✅ Verification

After applying solutions, verify:

1. ✅ Deployment status shows "Ready"
2. ✅ Visit your site: https://dvs-frontend-wine.vercel.app
3. ✅ Check browser console for errors (F12)
4. ✅ Test wallet connection
5. ✅ Test navigation

---

## 📞 Still Not Working?

### Option 1: Check Vercel Logs

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull logs
vercel logs https://dvs-frontend-wine.vercel.app
```

### Option 2: Contact Vercel Support

1. Go to: https://vercel.com/support
2. Click **Contact Support**
3. Provide:
   - Project name: `dvs-frontend-v8a9`
   - Error: "Error: forbidden"
   - Deployment URL
   - Screenshot

### Option 3: Redeploy from Scratch

1. Delete the Vercel project
2. Create new project
3. Import from GitHub
4. Configure settings
5. Add environment variables
6. Deploy

---

## 🎯 Most Likely Solution

Based on the error "Error: forbidden", the issue is **99% likely** to be:

### ⭐ Missing Environment Variables

**Quick Fix:**

1. Go to Vercel → Settings → Environment Variables
2. Add all 5 variables listed in Solution 1
3. Redeploy

**Why this works:**
- Vite requires `VITE_*` prefixed variables
- Missing variables cause build to fail
- Vercel shows "forbidden" for security reasons

---

## 📝 Prevention

To avoid this in the future:

1. ✅ Always set environment variables before deploying
2. ✅ Use `.env.example` as reference
3. ✅ Test build locally before pushing
4. ✅ Check Vercel deployment logs
5. ✅ Keep Node.js version consistent (20.x)

---

**Last Updated:** April 29, 2026  
**Status:** Troubleshooting Guide
