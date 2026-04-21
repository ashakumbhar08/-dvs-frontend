# DVS Smart Contracts

Soroban smart contracts for the Decentralized Verification System, deployed on **Stellar Testnet**.

## Contracts

### `certificate_contract`

Handles on-chain certificate lifecycle.

| Function | Description |
|---|---|
| `issue_certificate(recipient, task_id, metadata)` | Mints a new certificate on-chain and triggers `RewardContract::mint_reward()` |
| `verify_certificate(cert_id)` | Read-only lookup — returns full certificate metadata |
| `revoke_certificate(cert_id)` | Admin-only — marks a certificate as revoked |

### `reward_contract`

Manages XLM reward distribution to verified users.

| Function | Description |
|---|---|
| `mint_reward(recipient, amount, task_id)` | Transfers XLM from the reward pool to the recipient |
| `get_balance(address)` | Returns the current XLM balance of the reward pool |
| `transfer(from, to, amount)` | Admin-initiated reward adjustment |

## Build

```bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Build all contracts
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

## Deploy (Testnet)

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/certificate_contract.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>
```

Repeat for `reward_contract.wasm`. Update the resulting contract IDs in the frontend `.env` file:

```env
VITE_CERTIFICATE_CONTRACT_ID=C...
VITE_REWARD_CONTRACT_ID=C...
```
