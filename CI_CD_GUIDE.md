# CI/CD Implementation Guide

Complete guide to the CI/CD pipeline for DVS (Decentralized Verification System).

---

## Overview

This project uses a multi-stage CI/CD pipeline that handles:
- Frontend build and deployment (React + Vite)
- Smart contract compilation (Rust + Soroban)
- Automated testing and validation
- Artifact storage and deployment

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                       │
│                                                             │
│  Push to main / Pull Request                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions CI/CD                      │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Frontend Build  │  │  Contract Build  │                │
│  │                  │  │                  │                │
│  │  • Node.js 20    │  │  • Rust stable   │                │
│  │  • npm install   │  │  • wasm32 target │                │
│  │  • npm run lint  │  │  • Cargo build   │                │
│  │  • npm run build │  │  • WASM output   │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                     │                           │
│           └──────────┬──────────┘                           │
│                      ▼                                      │
│           ┌──────────────────────┐                          │
│           │  Integration Check   │                          │
│           │  • Verify artifacts  │                          │
│           │  • Check sizes       │                          │
│           └──────────┬───────────┘                          │
└──────────────────────┼──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│ Vercel Deploy   │         │ Contract Ready  │
│ (Automatic)     │         │ (Manual Deploy) │
│                 │         │                 │
│ • Production    │         │ • Testnet       │
│ • Preview       │         │ • Mainnet       │
└─────────────────┘         └─────────────────┘
```

---

## Workflows

### 1. Main CI/CD Pipeline

**File:** `.github/workflows/ci.yml`

**Purpose:** Continuous integration for all code changes

**Trigger:**
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**Jobs:**

#### Job 1: Frontend Build
- **Runtime:** Ubuntu Latest
- **Node Version:** 20.x
- **Steps:**
  1. Checkout code
  2. Setup Node.js with npm cache
  3. Install dependencies
  4. Run ESLint
  5. Build production bundle
  6. Upload `dist/` artifacts

**Artifacts:**
- Name: `frontend-build`
- Path: `dist/`
- Retention: 7 days

#### Job 2: Contract Build
- **Runtime:** Ubuntu Latest
- **Rust:** Stable toolchain
- **Target:** `wasm32-unknown-unknown`
- **Steps:**
  1. Checkout code
  2. Install Rust + WASM target
  3. Cache Cargo dependencies
  4. Build certificate_contract
  5. Build reward_contract
  6. Upload WASM files

**Artifacts:**
- Name: `contract-wasm`
- Files: `*.wasm`
- Retention: 30 days

#### Job 3: Integration Check
- **Depends on:** frontend-build, contract-build
- **Steps:**
  1. Download all artifacts
  2. Verify file existence
  3. Check contract sizes
  4. Report status

#### Job 4: Deployment Status
- **Runs on:** main branch only
- **Purpose:** Report deployment readiness

---

### 2. Contract Deployment Workflow

**File:** `.github/workflows/contract-deploy.yml`

**Purpose:** Manual deployment of smart contracts to Stellar

**Trigger:** Manual workflow dispatch

**Inputs:**
- `network`: Choice of testnet or mainnet

**Steps:**
1. Build contracts with optimizations
2. Run `soroban contract optimize`
3. Prepare for deployment
4. Upload optimized WASM files

**To Run:**
```bash
# Via GitHub UI:
1. Go to Actions tab
2. Select "Deploy Smart Contracts"
3. Click "Run workflow"
4. Choose network
5. Click "Run workflow" button

# Via GitHub CLI:
gh workflow run contract-deploy.yml -f network=testnet
```

**Extending for Actual Deployment:**

Uncomment and configure in workflow file:
```yaml
- name: Deploy CertificateContract
  env:
    SOROBAN_SECRET_KEY: ${{ secrets.SOROBAN_SECRET_KEY }}
  run: |
    soroban contract deploy \
      --wasm contracts/target/wasm32-unknown-unknown/release/certificate_contract.wasm \
      --network ${{ github.event.inputs.network }} \
      --source $SOROBAN_SECRET_KEY
```

**Required Secrets:**
- `SOROBAN_SECRET_KEY`: Stellar account secret key with XLM balance

---

### 3. Vercel Deployment Info

**File:** `.github/workflows/vercel-deploy.yml`

**Purpose:** Document Vercel deployment process

**Trigger:** Push to main, pull requests

**Output:** Deployment status and configuration info

---

## Vercel Integration

### Setup

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Select `dvs-frontend` project

2. **Configure Build:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node Version: 20.x
   ```

3. **Set Environment Variables:**
   ```env
   VITE_STELLAR_NETWORK=testnet
   VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
   VITE_CERTIFICATE_CONTRACT_ID=CXXXXX...
   VITE_REWARD_CONTRACT_ID=CXXXXX...
   ```

### Deployment Flow

**Production Deployment:**
```
Push to main → GitHub Actions CI → Vercel Build → Deploy to Production
```

**Preview Deployment:**
```
Open PR → GitHub Actions CI → Vercel Build → Deploy to Preview URL
```

**Rollback:**
```
Vercel Dashboard → Deployments → Select Previous → Promote to Production
```

---

## Caching Strategy

### Cargo Cache
```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.cargo/bin/
      ~/.cargo/registry/index/
      ~/.cargo/registry/cache/
      ~/.cargo/git/db/
      contracts/target/
    key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
```

**Benefits:**
- Faster contract builds (5-10x speedup)
- Reduced GitHub Actions minutes
- Consistent build environment

### NPM Cache
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
```

**Benefits:**
- Faster dependency installation
- Reduced network usage
- Consistent package versions

---

## Monitoring and Debugging

### View Build Status

**GitHub UI:**
1. Go to repository
2. Click "Actions" tab
3. Select workflow run
4. View logs for each job

**Status Badge:**
```markdown
![CI](https://github.com/ashakumbhar08/-dvs-frontend/actions/workflows/ci.yml/badge.svg)
```

### Download Artifacts

**Via GitHub UI:**
1. Go to Actions → Select workflow run
2. Scroll to "Artifacts" section
3. Download `frontend-build` or `contract-wasm`

**Via GitHub CLI:**
```bash
gh run list --workflow=ci.yml
gh run download <run-id>
```

### Common Issues

**Issue: Contract build fails**
```
Solution: Check Rust version and wasm32 target
rustup target add wasm32-unknown-unknown
```

**Issue: Frontend build fails**
```
Solution: Check Node version and dependencies
node --version  # Should be 20.x
npm ci  # Clean install
```

**Issue: Vercel deployment fails**
```
Solution: Check environment variables in Vercel dashboard
Ensure all VITE_* variables are set
```

---

## Security Best Practices

### Secrets Management

**Never commit:**
- Private keys
- Secret keys
- API tokens
- Contract IDs (use environment variables)

**Use GitHub Secrets for:**
- `SOROBAN_SECRET_KEY` (contract deployment)
- `VERCEL_TOKEN` (if using Vercel CLI)

**Configure in GitHub:**
```
Settings → Secrets and variables → Actions → New repository secret
```

### Environment Variables

**Development (.env.local):**
```env
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CERTIFICATE_CONTRACT_ID=
VITE_REWARD_CONTRACT_ID=
```

**Production (Vercel):**
- Set in Vercel dashboard
- Use production contract IDs
- Consider using mainnet for production

---

## Performance Optimization

### Build Times

**Current:**
- Frontend: ~30-60 seconds
- Contracts: ~2-5 minutes (first build)
- Contracts: ~30-60 seconds (cached)

**Optimization:**
- Cargo caching reduces contract build time by 80%
- NPM caching reduces frontend build time by 50%
- Parallel jobs reduce total pipeline time

### Artifact Sizes

**Frontend:**
- Uncompressed: ~1.3 MB
- Gzipped: ~350 KB

**Contracts:**
- certificate_contract.wasm: ~100-200 KB
- reward_contract.wasm: ~100-200 KB

---

## Extending the Pipeline

### Add Testing

```yaml
- name: Run tests
  run: npm test
```

### Add Code Coverage

```yaml
- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

### Add Contract Tests

```yaml
- name: Test contracts
  working-directory: contracts
  run: cargo test
```

### Add Deployment Notifications

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Troubleshooting

### Pipeline Fails on Main Branch

1. Check Actions tab for error logs
2. Review failed job details
3. Fix issue locally
4. Push fix to main

### Artifacts Not Available

1. Check artifact retention period (7-30 days)
2. Verify upload step succeeded
3. Check artifact name matches download step

### Vercel Deployment Out of Sync

1. Trigger manual deployment in Vercel
2. Check environment variables
3. Verify build command and output directory

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Soroban CLI Documentation](https://soroban.stellar.org/docs/tools/cli)
- [Cargo Documentation](https://doc.rust-lang.org/cargo/)

---

## Support

For CI/CD issues:
1. Check workflow logs in Actions tab
2. Review this guide
3. Open an issue on GitHub
4. Contact: ashakumbhar2006@gmail.com
