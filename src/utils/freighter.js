import {
  isConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api"

/**
 * Connect Freighter wallet.
 * Returns the public key string, or throws on failure.
 */
export const connectWallet = async () => {
  // 1. Check extension is installed and unlocked
  const connectedResult = await isConnected()
  console.log("[Freighter] isConnected:", connectedResult)

  if (connectedResult.error) {
    throw new Error(connectedResult.error.message || "Freighter not available")
  }

  if (!connectedResult.isConnected) {
    throw new Error("Freighter extension is not connected. Open it and unlock your wallet.")
  }

  // 2. Request access (shows popup if not already allowed)
  const accessResult = await requestAccess()
  console.log("[Freighter] requestAccess:", accessResult)

  if (accessResult.error) {
    throw new Error(accessResult.error.message || "Access denied by user")
  }

  // 3. Get the public key
  const addressResult = await getAddress()
  console.log("[Freighter] getAddress:", addressResult)

  if (addressResult.error) {
    throw new Error(addressResult.error.message || "Could not retrieve public key")
  }

  if (!addressResult.address) {
    throw new Error("No address returned from Freighter")
  }

  return addressResult.address
}

/**
 * Disconnect — Freighter has no disconnect API, so we just clear local state.
 */
export const disconnectWallet = () => {
  console.log("[Freighter] disconnected (local state cleared)")
}
