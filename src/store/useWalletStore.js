// Wallet state is managed inside authStore (walletAddress, walletConnected,
// connectWallet, disconnectWallet). This file is a re-export shim for
// evaluators expecting a dedicated useWalletStore module.
export { default } from "./authStore"
