# Smart Contract Deployment Guide

## ✅ Build Configuration Fixed

The contracts are now properly configured for Stellar testnet deployment with the `reference-types` issue resolved.

---

## What Was Fixed

### 1. Added `.cargo/config.toml`
**Path:** `contracts/.cargo/config.toml`

```toml
[target.wasm32-unknown-unknown]
rustflags = [
    "-C", "link-arg=-zstack-size=65536",
    "-C", "target-feature=-reference-types",
]
```

**Purpose:** Disables the `reference-types` WASM feature that causes deployment errors.

### 2. Updated Workspace `Cargo.toml`
**Path:** `contracts/Cargo.toml`

Added optimized release profile:
```toml
[profile.release]
opt-level = "z"              # Optimize for size
overflow-checks = true       # Keep overflow checks
debug = false                # No debug info
strip = "symbols"            # Strip symbols
debug-assertions = false     # No debug assertions
panic = "abort"              # Abort on panic
codegen-units = 1            # Single codegen unit
lto = true                   # Link-time optimization
```

### 3. Updated Contract `Cargo.toml` Files

Both contracts now have:
```toml
[lib]
crate-type = ["cdylib"]      # Dynamic library for WASM
doctest = false              # Disable doctests
```

---

## Build Commands

### Clean Build
```bash
cd dvs-frontend/contracts
cargo clean
cargo build --target wasm32-unknown-unknown --release
```

### Verify Build
```bash
ls -lh target/wasm32-unknown-unknown/release/*.wasm
```

**Expected output:**
```
certificate_contract.wasm  (~2.6 KB)
reward_contract.wasm       (~1.1 KB)
```

---

## Deployment Commands

### Prerequisites

1. **Install Stellar CLI:**
   ```bash
   cargo install --locked stellar-cli
   ```

2. **Configure Network:**
   ```bash
   stellar network add \
     --global testnet \
     --rpc-url https://soroban-testnet.stellar.org:443 \
     --network-passphrase "Test SDF Network ; September 2015"
   ```

3. **Create/Import Identity:**
   ```bash
   # Generate new identity
   stellar keys generate --global deployer --network testnet
   
   # Or import existing
   stellar keys add deployer --secret-key <YOUR_SECRET_KEY>
   ```

4. **Fund Account:**
   ```bash
   stellar keys fund deployer --network testnet
   ```

### Deploy CertificateContract

```bash
cd dvs-frontend/contracts

stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/certificate_contract.wasm \
  --source deployer \
  --network testnet
```

**Save the returned contract ID:**
```
CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Deploy RewardContract

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reward_contract.wasm \
  --source deployer \
  --network testnet
```

**Save the returned contract ID:**
```
CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Configure Frontend

### 1. Create `.env` file

**Path:** `dvs-frontend/.env`

```env
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CERTIFICATE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_REWARD_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Replace the `CXXX...` values with your actual deployed contract IDs.

### 2. Restart Dev Server

```bash
cd dvs-frontend
npm run dev
```

---

## Verify Deployment

### Check Contract Info

```bash
# Certificate Contract
stellar contract info \
  --id <CERTIFICATE_CONTRACT_ID> \
  --network testnet

# Reward Contract
stellar contract info \
  --id <REWARD_CONTRACT_ID> \
  --network testnet
```

### Invoke Contract (Test)

```bash
# Example: Call a read-only function
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- \
  <function_name> \
  --<param_name> <param_value>
```

---

## Troubleshooting

### Error: "reference-types not enabled"

**Solution:** Ensure `.cargo/config.toml` exists with:
```toml
rustflags = ["-C", "target-feature=-reference-types"]
```

### Error: "Account not found"

**Solution:** Fund your account:
```bash
stellar keys fund deployer --network testnet
```

### Error: "WASM file too large"

**Solution:** Optimize build:
```bash
cargo build --target wasm32-unknown-unknown --release
stellar contract optimize --wasm target/.../contract.wasm
```

### Error: "Invalid WASM"

**Solution:** Rebuild with correct configuration:
```bash
cargo clean
cargo build --target wasm32-unknown-unknown --release
```

---

## Contract Sizes

After optimization:
- **certificate_contract.wasm:** ~2.6 KB
- **reward_contract.wasm:** ~1.1 KB

Both are well under the Soroban size limit.

---

## Next Steps

1. ✅ Build contracts (done)
2. ✅ Fix reference-types issue (done)
3. ⏳ Deploy to testnet
4. ⏳ Configure frontend with contract IDs
5. ⏳ Test integration
6. ⏳ Verify transactions on Stellar Expert

---

## Useful Links

- **Stellar CLI Docs:** https://developers.stellar.org/docs/tools/developer-tools/cli
- **Soroban Docs:** https://soroban.stellar.org/docs
- **Testnet Explorer:** https://stellar.expert/explorer/testnet
- **Friendbot (Get XLM):** https://friendbot.stellar.org

---

## Summary

✅ **Build configuration fixed**  
✅ **reference-types disabled**  
✅ **WASM files generated successfully**  
✅ **Ready for deployment**  

**Contracts are now deployable to Stellar testnet!** 🚀
