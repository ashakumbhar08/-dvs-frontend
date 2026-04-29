# CI/CD Implementation Guide

**Project:** DVS - Decentralized Verification System  
**Date:** April 29, 2026  
**Status:** ✅ Production Ready

---

## 📋 Overview

This document provides complete details about the CI/CD pipeline implementation for the DVS frontend application.

---

## 🔄 Continuous Integration (GitHub Actions)

### Workflow File

**Location:** `.github/workflows/frontend-ci.yml`

### Full Workflow Configuration

```yaml
name: Frontend CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint
        continue-on-error: false

      - name: Build project
        run: npm run build
        env:
          CI: true

      - name: Check build output
        run: |
          echo "✅ Build completed successfully"
          echo "📦 Build artifacts:"
          ls -lh dist/
          echo ""
          echo "📊 Build size:"
          du -sh dist/

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist/
          retention-days: 7

  deployment-ready:
    name: Deployment Ready
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deployment status
        run: |
          echo "🚀 Deployment Status"
          echo "===================="
          echo ""
          echo "✅ CI checks passed"
          echo "✅ Build successful"
          echo "✅ Ready for deployment"
          echo ""
          echo "📦 Vercel will automatically deploy this build"
          echo "🔗 Live URL: https://dvs-frontend-wine.vercel.app"
```

---

## 🎯 Pipeline Stages

### Stage 1: Code Checkout
- Uses `actions/checkout@v4`
- Fetches the latest code from the repository
- Includes all branches and commit history

### Stage 2: Node.js Setup
- Uses `actions/setup-node@v4`
- Installs Node.js 18.x
- Enables npm caching for faster subsequent runs
- Cache key based on `package-lock.json`

### Stage 3: Dependency Installation
- Runs `npm ci` (clean install)
- Uses `package-lock.json` for reproducible builds
- Faster and more reliable than `npm install`
- Ensures consistent dependencies across environments

### Stage 4: Code Quality Check
- Runs `npm run lint`
- Uses ESLint to check code quality
- Fails the build if linting errors are found
- Ensures code follows project standards

### Stage 5: Production Build
- Runs `npm run build`
- Creates optimized production bundle
- Sets `CI=true` environment variable
- Outputs to `dist/` directory

### Stage 6: Build Verification
- Lists build artifacts
- Reports build size
- Confirms successful build completion
- Provides debugging information

### Stage 7: Artifact Upload
- Uploads `dist/` directory
- Retains artifacts for 7 days
- Available for download from Actions tab
- Useful for debugging and manual deployment

### Stage 8: Deployment Ready (Main Branch Only)
- Runs only on `main` branch pushes
- Reports deployment readiness
- Confirms Vercel will auto-deploy
- Provides live URL

---

## 🚀 Continuous Deployment (Vercel)

### Automatic Deployment

Vercel is connected to the GitHub repository and automatically deploys:

**Production Deployments:**
- Triggered by: Push to `main` branch
- URL: https://dvs-frontend-wine.vercel.app
- Build time: ~2-3 minutes
- Zero downtime deployment

**Preview Deployments:**
- Triggered by: Pull requests
- URL: Unique URL per PR (e.g., `dvs-frontend-git-feature-branch.vercel.app`)
- Automatically updated on new commits
- Deleted when PR is closed

### Vercel Configuration

**Project Settings:**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

**Environment Variables:**

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```env
# Stellar Network Configuration
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Smart Contract IDs
VITE_CERTIFICATE_CONTRACT_ID=CDAE4RN4PVDR2HEQNMQFMQLROPV32UQ4M2VVDXV2EAAUB6U7CZV74AE2
VITE_REWARD_CONTRACT_ID=CBNIXG7UUYJBXRHTCMEJNOTQBLN7CJQ3QMIV6BUVBSTCWAY7VXXDHJ4C

# Feature Flags
VITE_ENABLE_DEMO_MODE=false
```

---

## 📊 CI/CD Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    git push origin main
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions CI                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │  1. Checkout Code                                   │    │
│  │  2. Setup Node.js 18.x                             │    │
│  │  3. Install Dependencies (npm ci)                  │    │
│  │  4. Run ESLint                                     │    │
│  │  5. Build Project (npm run build)                  │    │
│  │  6. Verify Build Output                            │    │
│  │  7. Upload Artifacts                               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ CI Checks Pass
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Deployment                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  1. Detect Push to Main                            │    │
│  │  2. Clone Repository                               │    │
│  │  3. Install Dependencies                           │    │
│  │  4. Build Project                                  │    │
│  │  5. Deploy to Production                           │    │
│  │  6. Update DNS                                     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    🚀 Live on Production
                              ↓
              https://dvs-frontend-wine.vercel.app
```

---

## 🎯 Status Badges

### Frontend CI Badge

**Markdown:**
```markdown
![Frontend CI](https://github.com/ashakumbhar08/-dvs-frontend/actions/workflows/frontend-ci.yml/badge.svg?branch=main)
```

**HTML:**
```html
<img src="https://github.com/ashakumbhar08/-dvs-frontend/actions/workflows/frontend-ci.yml/badge.svg?branch=main" alt="Frontend CI">
```

**Direct URL:**
```
https://github.com/ashakumbhar08/-dvs-frontend/actions/workflows/frontend-ci.yml/badge.svg?branch=main
```

### Vercel Deployment Badge

**Markdown:**
```markdown
![Vercel Deployment](https://vercelbadge.vercel.app/api/ashakumbhar08/-dvs-frontend)
```

---

## 📈 Performance Metrics

### Build Times

| Stage | Average Time |
|-------|--------------|
| Checkout | ~5 seconds |
| Node.js Setup | ~10 seconds |
| Install Dependencies | ~30 seconds (cached: ~10s) |
| Lint | ~5 seconds |
| Build | ~20 seconds |
| Upload Artifacts | ~5 seconds |
| **Total** | **~75 seconds** (cached: ~55s) |

### Deployment Times

| Platform | Average Time |
|----------|--------------|
| GitHub Actions CI | ~1-2 minutes |
| Vercel Deployment | ~2-3 minutes |
| **Total (Push to Live)** | **~3-5 minutes** |

---

## 🔧 Local Testing

Before pushing code, test locally to ensure CI will pass:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Linter
```bash
npm run lint
```

**Fix linting errors:**
```bash
npm run lint -- --fix
```

### 3. Build Project
```bash
npm run build
```

### 4. Preview Build
```bash
npm run preview
```

### 5. Check Build Output
```bash
ls -lh dist/
du -sh dist/
```

---

## 🐛 Troubleshooting

### CI Build Fails

**Problem:** Linting errors

**Solution:**
```bash
npm run lint -- --fix
git add .
git commit -m "fix: resolve linting errors"
git push
```

**Problem:** Build fails

**Solution:**
```bash
# Check for errors locally
npm run build

# Check Node.js version
node --version  # Should be 18.x

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem:** Dependencies issue

**Solution:**
```bash
# Use clean install
npm ci

# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

### Vercel Deployment Fails

**Problem:** Environment variables missing

**Solution:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables
5. Redeploy

**Problem:** Build command fails

**Solution:**
1. Check Vercel build logs
2. Verify `package.json` scripts
3. Test build locally: `npm run build`
4. Check Node.js version in Vercel settings

---

## 📚 Best Practices

### 1. Always Test Locally First
```bash
npm run lint && npm run build
```

### 2. Use Meaningful Commit Messages
```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update README"
```

### 3. Create Feature Branches
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create pull request
```

### 4. Review Preview Deployments
- Every PR gets a preview URL
- Test changes before merging
- Share preview URL with team

### 5. Monitor Build Status
- Check CI badge on README
- Review GitHub Actions logs
- Monitor Vercel deployment logs

---

## 🔐 Security

### Environment Variables
- Never commit `.env` files
- Use Vercel dashboard for secrets
- Rotate sensitive credentials regularly

### Dependencies
- Run `npm audit` regularly
- Update dependencies: `npm update`
- Review security advisories

### Access Control
- Limit GitHub repository access
- Use branch protection rules
- Require PR reviews before merge

---

## 📞 Support

**GitHub Actions Issues:**
- Check [Actions tab](https://github.com/ashakumbhar08/-dvs-frontend/actions)
- Review workflow logs
- Check GitHub Actions status: https://www.githubstatus.com

**Vercel Issues:**
- Check Vercel Dashboard
- Review deployment logs
- Check Vercel status: https://www.vercel-status.com

**Project Issues:**
- Create issue on GitHub
- Contact: ashakumbhar2006@gmail.com

---

## 📝 Summary

✅ **CI Pipeline:** GitHub Actions with lint + build checks  
✅ **CD Pipeline:** Vercel automatic deployment  
✅ **Build Time:** ~1-2 minutes (CI)  
✅ **Deploy Time:** ~2-3 minutes (Vercel)  
✅ **Total Time:** ~3-5 minutes (push to live)  
✅ **Status Badges:** Real-time build status  
✅ **Preview Deployments:** Automatic PR previews  
✅ **Zero Downtime:** Seamless deployments  

---

**Last Updated:** April 29, 2026  
**Maintained By:** Asha Kumbhar
