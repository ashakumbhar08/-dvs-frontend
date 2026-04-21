

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

## CI/CD

This project uses **GitHub Actions** for continuous integration and **Vercel** for deployment.

**GitHub Actions** runs automatically on every push to the `main` branch:
1. Checks out the repository
2. Installs dependencies (`npm install`)
3. Builds the project (`npm run build`)

Workflow file: `.github/workflows/ci.yml`

**Vercel** handles deployment automatically:
- Every push to `main` triggers a production deployment
- Pull requests generate preview deployments
- No manual steps required after initial Vercel project setup

**Build command:** `npm run build`  
**Output directory:** `dist`  
**Framework preset:** Vite

## Smart Contracts

DVS uses two Soroban smart contracts deployed on **Stellar Testnet**. Source code lives in the [`contracts/`](./contracts) folder.

### CertificateContract

Manages the full on-chain certificate lifecycle — minting, verification, and revocation.

- `issue_certificate(recipient, task_id, metadata)` — mints a tamper-proof certificate and triggers XLM reward payout
- `verify_certificate(cert_id)` — read-only lookup used by the public `/verify` page
- `revoke_certificate(cert_id)` — admin-only function to invalidate a certificate on-chain

### RewardContract

Handles XLM reward distribution to users whose submissions are approved.

- `mint_reward(recipient, amount, task_id)` — called by `CertificateContract` to transfer XLM from the reward pool
- `get_balance(address)` — returns the current pool balance shown in the Admin Dashboard
- `transfer(from, to, amount)` — admin-initiated reward adjustment

Both contracts are written in Rust using the [Soroban SDK](https://soroban.stellar.org) and target Stellar Testnet. See [`contracts/README.md`](./contracts/README.md) for build and deploy instructions.

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
├── contracts/
│   ├── certificate_contract/
│   │   ├── src/lib.rs        # Issue, verify, revoke certificates
│   │   └── Cargo.toml
│   ├── reward_contract/
│   │   ├── src/lib.rs        # Mint rewards, get balance, transfer
│   │   └── Cargo.toml
│   ├── Cargo.toml            # Workspace manifest
│   └── README.md             # Build & deploy instructions
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI pipeline
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
