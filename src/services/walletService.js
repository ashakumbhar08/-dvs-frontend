// PLACEHOLDER — replace with Freighter SDK calls
// import { getPublicKey, isConnected } from "@stellar/freighter-api"

export const connectWallet = async () => {
  await new Promise((r) => setTimeout(r, 800))
  return { address: "GBMOCK7X3KL9QZPN1234ABCDEF", connected: true }
}

export const disconnectWallet = async () => {
  return { connected: false }
}

export const signTransaction = async (txXdr) => {
  await new Promise((r) => setTimeout(r, 600))
  return { signedTxXdr: "MOCK_SIGNED_TX_XDR" }
}
