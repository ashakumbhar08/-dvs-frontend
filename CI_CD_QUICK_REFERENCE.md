# CI/CD Quick Reference

Quick commands and status checks for the DVS CI/CD pipeline.

---

## Status Checks

### View Build Status
```bash
# Check latest workflow runs
gh run list --limit 5

# View specific run
gh run view <run-id>

# Watch live run
gh run watch
```

### Check Deployment Status
```bash
# Vercel deployments
vercel ls

# Latest deployment
vercel inspect
```

---

## Workflows

### Main CI/CD Pipeline
- **File:** `.github/workflows/ci.yml`
- **Trigger:** Push to main, Pull requests
- **Jobs:** Frontend build, Contract build, Integration check
- **Duration:** ~3-5 minutes

### Contract Deployment
- **File:** `.github/workflows/contract-deploy.yml`
- **Trigger:** Manual
- **Command:** `gh workflow run contract-deploy.yml -f network=testnet`

### Vercel Info
- **File:** `.github/workflows/vercel-deploy.yml`
- **Trigger:** Push to main, Pull requests
- **Purpose:** Documentation

---

## Common Commands

### Local Build Testing
```bash
# Frontend
npm install
npm run lint
npm run build

# Contracts
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

### Download Artifacts
```bash
# List recent runs
gh run list --workflow=ci.yml

# Download artifacts from specific run
gh run download <run-id>

# Download latest
gh run download
```

### Trigger Manual Deployment
```bash
# Deploy contracts to testnet
gh workflow run contract-deploy.yml -f network=testnet

# Deploy contracts to mainnet
gh workflow run contract-deploy.yml -f network=mainnet
```

---

## Environment Variables

### Required for Vercel
```env
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CERTIFICATE_CONTRACT_ID=<contract-id>
VITE_REWARD_CONTRACT_ID=<contract-id>
```

### Required for Contract Deployment
```env
SOROBAN_SECRET_KEY=<stellar-secret-key>
```

---

## Troubleshooting

### Build Fails
```bash
# Check logs
gh run view <run-id> --log-failed

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### Clear Caches
```bash
# Delete workflow caches
gh cache delete <cache-key>

# List all caches
gh cache list
```

### Force Rebuild
```bash
# Trigger workflow manually
gh workflow run ci.yml
```

---

## Monitoring

### CI Badge
```markdown
![CI](https://github.com/ashakumbhar08/-dvs-frontend/actions/workflows/ci.yml/badge.svg)
```

### Vercel Badge
```markdown
![Vercel](https://vercelbadge.vercel.app/api/ashakumbhar08/-dvs-frontend)
```

---

## Links

- **Actions:** https://github.com/ashakumbhar08/-dvs-frontend/actions
- **Vercel:** https://vercel.com/dashboard
- **Live App:** https://dvs-frontend-wine.vercel.app
- **Full Guide:** [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)
