

# DVS — Decentralized Verification System

![Vercel](https://vercelbadge.vercel.app/api/ashakumbhar08/-dvs-frontend)

---

## Overview

DVS is a blockchain-based credential verification platform built on the Stellar network using Soroban smart contracts. Users complete tasks, submit verifiable proof, and receive tamper-proof on-chain certificates with XLM rewards. Admins manage tasks, review submissions, and issue certificates through a dedicated dashboard.

> This project demonstrates real-world blockchain credential verification using Stellar and Soroban — from task submission to on-chain certificate issuance and reward distribution.

## Features

- Freighter wallet connection (Stellar testnet)
- Task creation, submission, and approval workflow
- On-chain certificate issuance via Soroban smart contracts
- XLM reward distribution on approval
- Certificate verification by ID or transaction hash
- Role-based access: User dashboard + Admin dashboard
- Activity feed with full event cycle tracking
- Responsive UI — mobile-first Tailwind design

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19 + Vite 8                   |
| Styling     | Tailwind CSS v4                     |
| State       | Zustand v5                          |
| Routing     | React Router v7                     |
| Wallet      | Freighter (@stellar/freighter-api)  |
| Blockchain  | Stellar Testnet + Soroban           |
| Deploy      | Vercel                              |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     DVS Frontend                        │
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │
│  │  Public  │   │   User   │   │      Admin       │    │
│  │  Layout  │   │  Layout  │   │      Layout      │    │
│  │          │   │          │   │                  │    │
│  │ Landing  │   │Dashboard │   │ AdminDashboard   │    │
│  │ Login    │   │ Tasks    │   │ TaskManagement   │    │
│  │ Verify   │   │ Certs    │   │ ApprovalQueue    │    │
│  └────┬─────┘   └────┬─────┘   └────────┬─────────┘    │
│       │              │                  │               │
│  ┌────▼──────────────▼──────────────────▼─────────┐    │
│  │              Zustand Stores                     │    │
│  │  authStore  │  taskStore  │  toastStore         │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                 │
│  ┌────────────────────▼────────────────────────────┐    │
│  │              Service Layer                      │    │
│  │  walletService.js  │  contractService.js        │    │
│  │  freighter.js      │  api.js                    │    │
│  └────────────────────┬────────────────────────────┘    │
└───────────────────────┼─────────────────────────────────┘
                        │
          ┌─────────────▼──────────────┐
          │     Stellar Testnet        │
          │                            │
          │  ┌──────────────────────┐  │
          │  │  CertificateContract │  │
          │  │  issue_certificate() │  │
          │  │  verify_certificate()│  │
          │  │  revoke_certificate()│  │
          │  └──────────┬───────────┘  │
          │             │ calls        │
          │  ┌──────────▼───────────┐  │
          │  │    RewardContract    │  │
          │  │    mint_reward()     │  │
          │  │    get_balance()     │  │
          │  │    transfer()        │  │
          │  └──────────────────────┘  │
          └────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+
- [Freighter wallet extension](https://freighter.app) installed in your browser
- Freighter configured to Stellar Testnet

### Installation

```bash
git clone https://github.com/ashakumbhar08/-dvs-frontend.git
cd dvs-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Login

| Role  | Email            | Notes                        |
|-------|------------------|------------------------------|
| User  | aryan@dvs.io     | Redirects to /dashboard      |
| Admin | admin@dvs.io     | Redirects to /admin          |

Connect Freighter wallet on the signup page to complete wallet linking.

## Environment Variables

No environment variables are required for the current mock-data build.

For production Soroban integration, create a `.env` file:

```env
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CERTIFICATE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_REWARD_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Live Demo

🔗 **Live App:** [https://dvs-frontend-wine.vercel.app](https://dvs-frontend-wine.vercel.app)

📁 **GitHub:** [https://github.com/ashakumbhar08/-dvs-frontend](https://github.com/ashakumbhar08/-dvs-frontend)

## 📱 Mobile View

![Mobile View](./screenshots/mobile.jpg)

## Screenshots

> Add screenshots to the `screenshots/` folder.

| Screen              | File                          |
|---------------------|-------------------------------|
| Landing Page        | screenshots/landing.png       |
| User Dashboard      | screenshots/dashboard.png     |
| Task Browser        | screenshots/tasks.png         |
| Certificate Detail  | screenshots/certificate.png   |
| Admin Queue         | screenshots/admin-queue.png   |

## CI/CD — Vercel

This project is configured for automatic deployment via Vercel.

**How it works:**
1. Push any commit to the `main` branch
2. Vercel detects the push via GitHub webhook
3. Vercel runs `npm run build` (Vite production build)
4. On success, the new build is promoted to the live URL automatically
5. Preview deployments are created for every pull request

**Build command:** `npm run build`  
**Output directory:** `dist`  
**Framework preset:** Vite

No manual deployment steps are required after the initial Vercel project setup.

## Smart Contracts (Future Scope)

Smart contract integration is stubbed in `src/services/contractService.js` and `src/utils/freighter.js`. Replace the placeholder implementations with real Soroban contract calls when contracts are deployed.

### CertificateContract

```rust
// issue_certificate(recipient: Address, task_id: String, metadata: Map) -> CertId
// verify_certificate(cert_id: String) -> CertificateData
// revoke_certificate(cert_id: String) -> bool
```

**`issue_certificate()`** — mints a new on-chain certificate NFT, stores metadata (task ID, issuer, timestamp, recipient), and calls `RewardContract::mint_reward()` to trigger the XLM payout in the same transaction.

**`verify_certificate()`** — read-only call that returns full certificate metadata for a given ID or hash. Used by the public `/verify` page.

**`revoke_certificate()`** — admin-only function that marks a certificate as revoked on-chain. Revoked certificates return `status: revoked` on verification.

### RewardContract

```rust
// mint_reward(recipient: Address, amount: i128, task_id: String) -> TxHash
// get_balance(address: Address) -> i128
// transfer(from: Address, to: Address, amount: i128) -> TxHash
```

**`mint_reward()`** — called internally by `CertificateContract::issue_certificate()` via inter-contract call. Transfers XLM from the reward pool to the recipient wallet and emits a `RewardSent` event.

**`get_balance()`** — returns the current XLM balance of the reward pool. Used by the Admin Dashboard pool balance indicator.

**`transfer()`** — general-purpose transfer function for admin-initiated reward adjustments.

### Inter-Contract Call Flow

```
Admin approves submission
        │
        ▼
CertificateContract::issue_certificate()
        │
        ├── stores certificate on-chain
        ├── emits CertificateMinted event
        │
        └── calls RewardContract::mint_reward()
                    │
                    ├── transfers XLM to recipient
                    └── emits RewardSent event
```

## Future Scope

| Feature                        | Status    | Notes                                      |
|--------------------------------|-----------|--------------------------------------------|
| Soroban contract deployment    | Planned   | Testnet first, mainnet after audit         |
| Real Freighter signing         | Partial   | Connection works; tx signing stubbed       |
| Certificate NFT metadata       | Planned   | IPFS storage for certificate images        |
| Leaderboard                    | Planned   | XP-ranked public leaderboard               |
| Multi-issuer support           | Planned   | Any verified node can issue certificates   |
| Mobile app (React Native)      | Backlog   | Freighter mobile SDK required              |
| DAO governance                 | Backlog   | DVS token holders vote on task rewards     |
| ZK proof verification          | Research  | Privacy-preserving credential verification |

## Commit History

Commits follow conventional commit format:

```
feat: add Freighter wallet connection
feat: implement approval queue with contract stubs
feat: add certificate verification page
fix: wallet address truncation on mobile
fix: zustand persist hydration on first render
style: replace all indigo/purple with brand color palette
refactor: migrate dummy data to src/data/mockData.js
docs: add README with architecture and smart contract spec
```

## Project Structure

```
dvs-frontend/
├── public/
│   └── favicon.svg
├── screenshots/              # Add screenshots here
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/           # Navbar, Sidebar, Cards, Modal, Toast
│   │   ├── forms/            # LoginForm, TaskForm, SubmissionForm
│   │   └── wallet/           # WalletModal
│   ├── data/
│   │   └── mockData.js       # All static mock data
│   ├── hooks/                # useAuth, useTasks, useWallet, etc.
│   ├── layouts/              # PublicLayout, UserLayout, AdminLayout
│   ├── pages/
│   │   ├── user/             # Dashboard, TaskBrowser, MyCertificates, etc.
│   │   └── admin/            # AdminDashboard, TaskManagement, ApprovalQueue
│   ├── services/             # api.js, contractService.js, walletService.js
│   ├── store/                # authStore, taskStore, toastStore
│   └── utils/                # formatters, formatWallet, constants, freighter
├── index.html
├── vite.config.js
├── tailwind.config.js
├── README.md
└── LICENSE
```

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit your changes — `git commit -m "feat: describe your change"`
4. Push to your fork — `git push origin feat/your-feature`
5. Open a Pull Request

Please keep PRs focused and follow the existing code style.

## Acknowledgements

- [Stellar Development Foundation](https://stellar.org) — for the Stellar network and Soroban SDK
- [Freighter](https://freighter.app) — for the browser wallet extension
- [Vercel](https://vercel.com) — for zero-config deployment
- [Tailwind CSS](https://tailwindcss.com) — for the utility-first styling system

## Support & Contact

If you have questions, found a bug, or want to collaborate:

- **Email:** ashakumbhar2006@gmail.com
- **GitHub:** [@ashakumbhar08](https://github.com/ashakumbhar08)
- **Issues:** [Open an issue](https://github.com/ashakumbhar08/-dvs-frontend/issues)

## License

MIT — see [LICENSE](./LICENSE)
