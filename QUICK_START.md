# Quick Start - Real Blockchain Integration

## What Changed?

✅ **All mock data removed**  
✅ **Real Stellar SDK integration**  
✅ **Real Freighter wallet signing**  
✅ **Real blockchain transactions**

## Files Modified

1. **`src/services/contractService.js`** - Real Soroban contract calls
2. **`src/services/walletService.js`** - Real transaction signing
3. **`src/utils/freighter.js`** - Enhanced wallet utilities
4. **`package.json`** - Added `@stellar/stellar-sdk`

## New Files

1. **`.env.example`** - Environment variable template
2. **`src/utils/contractConfig.js`** - Configuration utilities
3. **`DEPLOYMENT.md`** - Full deployment guide
4. **`INTEGRATION_SUMMARY.md`** - Detailed changes

## How to Use

### Option 1: With Deployed Contracts (Full Blockchain)

1. Deploy contracts to Stellar Testnet:
   ```bash
   cd contracts
   cargo build --target wasm32-unknown-unknown --release
   soroban contract deploy --wasm target/wasm32-unknown-unknown/release/certificate_contract.wasm --network testnet
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your contract IDs to `.env`:
   ```env
   VITE_CERTIFICATE_CONTRACT_ID=CXXXXX...
   VITE_REWARD_CONTRACT_ID=CXXXXX...
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

5. Connect Freighter wallet and test!

### Option 2: Without Deployed Contracts (Development Mode)

The app will detect missing contract IDs and show a configuration message. You can still:
- Test wallet connection
- Navigate the UI
- See the integration code structure

## Key Functions

### `issueCertificate(recipient, taskId, metadata)`
Issues a real certificate on Stellar blockchain.

**Returns:**
```javascript
{
  success: true,
  txHash: "abc123...", // Real Stellar transaction hash
  certId: "cert_123"
}
```

### `verifyCertificate(certId)`
Verifies a certificate by querying the blockchain.

**Returns:**
```javascript
{
  valid: true,
  certificate: { /* certificate data */ },
  txHash: "abc123..."
}
```

### `approveSubmission(submissionId, userId, rewardXlm)`
Approves a submission and issues certificate on-chain.

**Returns:**
```javascript
{
  success: true,
  txHash: "abc123...",
  certId: "cert_123"
}
```

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Wallet not connected" | Freighter not connected | Connect Freighter wallet |
| "Contract ID not configured" | Missing .env variables | Add contract IDs to .env |
| "Transaction signing failed" | User rejected | Approve transaction in Freighter |
| "Simulation failed" | Contract error | Check contract parameters |

## Testing Checklist

- [ ] Freighter installed and unlocked
- [ ] Freighter set to Testnet network
- [ ] Account has testnet XLM (get from friendbot)
- [ ] Contracts deployed to testnet
- [ ] Contract IDs in `.env` file
- [ ] Dev server restarted after `.env` changes
- [ ] Wallet connected in app
- [ ] Test transaction succeeds
- [ ] Real transaction hash returned
- [ ] Transaction visible on Stellar Expert

## Verification

Check if integration is working:

1. **Console logs** - Should show Stellar SDK operations
2. **Freighter popup** - Should show real transaction details
3. **Transaction hash** - Should be 64-character hex string
4. **Stellar Explorer** - Transaction should be visible

## Resources

- **Stellar Testnet:** https://horizon-testnet.stellar.org
- **Soroban RPC:** https://soroban-testnet.stellar.org
- **Stellar Expert:** https://stellar.expert/explorer/testnet
- **Friendbot (get XLM):** https://friendbot.stellar.org
- **Freighter Wallet:** https://freighter.app

## Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
2. Check [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) for technical details
3. Check [contracts/README.md](./contracts/README.md) for contract documentation
