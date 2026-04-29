# Smart Contract Deployment Guide

This guide explains how to deploy the Soroban smart contracts and configure the frontend.

## Prerequisites

- Rust and Cargo installed
- Soroban CLI installed: `cargo install --locked soroban-cli`
- Stellar account with testnet XLM (get from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test))

## Step 1: Build Contracts

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

This creates WASM files in `target/wasm32-unknown-unknown/release/`:
- `certificate_contract.wasm`
- `reward_contract.wasm`

## Step 2: Deploy to Stellar Testnet

### Deploy CertificateContract

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/certificate_contract.wasm \
  --network testnet \
  --source YOUR_SECRET_KEY
```

Save the returned contract ID (starts with `C...`).

### Deploy RewardContract

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reward_contract.wasm \
  --network testnet \
  --source YOUR_SECRET_KEY
```

Save the returned contract ID.

## Step 3: Configure Frontend

Create a `.env` file in the `dvs-frontend` directory:

```env
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CERTIFICATE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_REWARD_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Replace the `CXXX...` values with your actual deployed contract IDs.

## Step 4: Test Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Connect your Freighter wallet (configured for Testnet)

3. Try issuing a certificate through the admin panel

4. Check the transaction on [Stellar Expert](https://stellar.expert/explorer/testnet)

## Troubleshooting

### "Contract ID not configured"
- Make sure your `.env` file exists and contains valid contract IDs
- Restart the dev server after creating/modifying `.env`

### "Wallet not connected"
- Install Freighter browser extension
- Switch Freighter to Testnet network
- Ensure your account has testnet XLM

### "Transaction failed"
- Check that your account has sufficient XLM for fees
- Verify contract IDs are correct
- Check Soroban RPC URL is accessible

## Contract Functions

### CertificateContract

- `issue_certificate(recipient, task_id, metadata)` - Issue a new certificate
- `verify_certificate(cert_id)` - Verify a certificate by ID
- `revoke_certificate(cert_id)` - Revoke a certificate (admin only)

### RewardContract

- `mint_reward(recipient, amount, task_id)` - Distribute XLM reward
- `get_balance(address)` - Get reward pool balance
- `transfer(from, to, amount)` - Transfer XLM (admin only)

## Network Information

- **Testnet RPC:** https://soroban-testnet.stellar.org
- **Testnet Horizon:** https://horizon-testnet.stellar.org
- **Network Passphrase:** `Test SDF Network ; September 2015`
- **Friendbot (get testnet XLM):** https://friendbot.stellar.org

## Next Steps

After successful deployment:
1. Update README.md with your contract IDs
2. Test all contract functions
3. Consider adding contract verification
4. Plan for mainnet deployment after security audit
