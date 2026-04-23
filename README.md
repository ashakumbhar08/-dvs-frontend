# DVS — Decentralized Verification System

![Vercel](https://vercelbadge.vercel.app/api/ashakumbhar08/-dvs-frontend)

## Overview

DVS is a blockchain-based credential verification platform built on the Stellar Testnet using Soroban smart contracts. Users complete tasks, submit verifiable proof, and receive tamper-proof on-chain certificates along with XLM rewards. Admins manage tasks, review submissions, and issue certificates through a dedicated dashboard.

## Smart Contracts

This project includes two Soroban smart contracts:

- **CertificateContract** — Issues and verifies on-chain certificates
- **RewardContract** — Handles XLM reward distribution

All contracts are located in the `/contracts` directory and deployed on the Stellar Testnet.

## CI/CD

This project uses GitHub Actions for continuous integration.

- Runs automatically on every push to the main branch
- Installs dependencies and builds the project
- Deployment handled via Vercel

## Features

- Wallet login via Freighter
- Task submission & verification
- On-chain certificate issuance
- Reward tracking system
- Admin dashboard for approvals

## Tech Stack

- React + Vite
- Tailwind CSS
- Zustand
- Stellar Testnet
- Soroban Smart Contracts
- Freighter Wallet
- Vercel
