# DVS — Decentralized Verification System

![Vercel](https://vercelbadge.vercel.app/api/ashakumbhar08/-dvs-frontend)

> A blockchain-based credential verification platform built on Stellar Testnet using Soroban smart contracts.

---

## 📋 Overview

DVS (Decentralized Verification System) is a decentralized application that enables transparent and tamper-proof credential verification on the blockchain. Users complete tasks, submit verifiable proof, and receive on-chain certificates with XLM rewards. Administrators manage task creation, review submissions, and issue certificates through a dedicated dashboard.

**Problem it solves:**
- Eliminates credential fraud through blockchain immutability
- Automates reward distribution via smart contracts
- Provides transparent verification accessible to anyone

---

## ✨ Key Features

- **Wallet Authentication** — Secure login via Freighter wallet (Stellar Testnet)
- **Task Management** — Create, browse, and submit tasks with proof attachments
- **On-Chain Certificates** — Tamper-proof certificate issuance stored on Stellar blockchain
- **Automated Rewards** — XLM rewards distributed automatically upon approval
- **Public Verification** — Anyone can verify certificate authenticity using certificate ID
- **Admin Dashboard** — Dedicated interface for task management and submission approvals
- **Role-Based Access** — Separate user and admin workflows with protected routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand v5 |
| **Routing** | React Router v7 |
| **Blockchain** | Stellar Testnet, Soroban SDK |
| **Wallet Integration** | Freighter (@stellar/freighter-api) |
| **Smart Contracts** | Rust, Soroban |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel |

---

## 📜 Smart Contracts

DVS uses two Soroban smart contracts deployed on **Stellar Testnet**. Source code is located in the [`/contracts`](./contracts) directory.

### 1. CertificateContract

Manages the complete certificate lifecycle on-chain.

| Function | Description |
|----------|-------------|
| `issue_certificate(recipient, task_id, metadata)` | Mints a new certificate NFT and triggers reward distribution |
| `verify_certificate(cert_id)` | Read-only function returning full certificate metadata |
| `revoke_certificate(cert_id)` | Admin-only function to invalidate certificates |

**Key Features:**
- Stores certificate metadata (recipient, task ID, issuer, timestamp, status)
- Emits events for certificate minting and revocation
- Calls `RewardContract` to trigger XLM payout

### 2. RewardContract

Handles XLM reward distribution to verified users.

| Function | Description |
|----------|-------------|
| `mint_reward(recipient, amount, task_id)` | Transfers XLM from reward pool to recipient |
| `get_balance(address)` | Returns current reward pool balance |
| `transfer(from, to, amount)` | Admin-initiated reward adjustments |

**Key Features:**
- Automated reward distribution upon certificate issuance
- Transparent pool balance tracking
- Admin controls for reward management

**Contract Interaction Flow:**
```
Admin Approves Submission
        ↓
CertificateContract::issue_certificate()
        ↓
RewardContract::mint_reward()
        ↓
XLM transferred to user wallet
```

---

## 🔄 CI/CD

This project implements continuous integration and deployment using **GitHub Actions** and **Vercel**.

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

**Triggers:** Automatically runs on every push to the `main` branch

**Steps:**
1. Checkout repository
2. Set up Node.js environment
3. Install dependencies (`npm install`)
4. Build project (`npm run build`)

### Vercel Deployment

- **Automatic deployment** on push to `main`
- **Preview deployments** for pull requests
- **Build command:** `npm run build`
- **Output directory:** `dist`

---

## 📁 Project Structure

```
dvs-frontend/
├── contracts/                    # Soroban smart contracts
│   ├── certificate_contract/     # Certificate issuance & verification
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── reward_contract/          # XLM reward distribution
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── Cargo.toml                # Workspace manifest
│   └── README.md                 # Contract documentation
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI pipeline
├── src/
│   ├── components/               # Reusable UI components
│   ├── pages/                    # User & admin pages
│   ├── services/                 # API & contract services
│   ├── store/                    # Zustand state management
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Helper functions
├── public/                       # Static assets
├── screenshots/                  # Project screenshots
└── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- [Freighter wallet extension](https://freighter.app) installed and configured for Stellar Testnet
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashakumbhar08/-dvs-frontend.git
   cd dvs-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Demo Credentials

| Role | Email | Access |
|------|-------|--------|
| User | aryan@dvs.io | User dashboard |
| Admin | admin@dvs.io | Admin panel |

Connect your Freighter wallet after login to complete wallet linking.

---

## 🔍 How It Works

### User Flow
1. User connects Freighter wallet and logs in
2. Browses available tasks in the task browser
3. Submits task completion proof (text/file)
4. Waits for admin approval
5. Receives on-chain certificate + XLM reward upon approval

### Admin Flow
1. Admin logs into admin dashboard
2. Creates new tasks with reward amounts
3. Reviews pending submissions in approval queue
4. Approves/rejects submissions
5. System automatically issues certificate and distributes XLM

### Verification Flow
1. Anyone visits the public verification page
2. Enters certificate ID or transaction hash
3. System queries `CertificateContract::verify_certificate()`
4. Displays certificate metadata and validity status

---

## 📸 Screenshots

### Mobile View
![Mobile Interface](./screenshots/mobile.jpg)

---

## 🔮 Future Improvements

- [ ] Deploy contracts to Stellar Mainnet after security audit
- [ ] Implement IPFS storage for certificate metadata and images
- [ ] Add leaderboard with XP-based ranking system
- [ ] Multi-issuer support for decentralized certificate issuance
- [ ] Mobile app using React Native + Freighter Mobile SDK
- [ ] DAO governance for community-driven task reward voting
- [ ] Zero-knowledge proof integration for privacy-preserving verification

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 👤 Author

**Asha Kumbhar**

- GitHub: [@ashakumbhar08](https://github.com/ashakumbhar08)
- Email: ashakumbhar2006@gmail.com
- Project Repository: [DVS Frontend](https://github.com/ashakumbhar08/-dvs-frontend)

---

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org) — Stellar network and Soroban SDK
- [Freighter](https://freighter.app) — Stellar wallet browser extension
- [Vercel](https://vercel.com) — Deployment platform
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework

---

**⭐ If you find this project useful, please consider giving it a star!**
