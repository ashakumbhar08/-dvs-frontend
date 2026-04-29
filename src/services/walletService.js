import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";

/**
 * Returns true if the Freighter extension is present in the browser.
 */
export function isFreighterInstalled() {
  return typeof window !== "undefined" && !!window.freighter;
}

/**
 * Connect Freighter and return { publicKey, connected }.
 * Never throws — returns { publicKey: null, connected: false } on any failure.
 */
export async function connectFreighter() {
  try {
    const connectedResult = await isConnected();
    if (connectedResult.error || !connectedResult.isConnected) {
      console.warn("[walletService] Freighter not connected:", connectedResult.error?.message);
      return { publicKey: null, connected: false };
    }

    const accessResult = await requestAccess();
    if (accessResult.error) {
      console.warn("[walletService] Access denied:", accessResult.error.message);
      return { publicKey: null, connected: false };
    }

    const addressResult = await getAddress();
    if (addressResult.error || !addressResult.address) {
      console.warn("[walletService] Could not get address:", addressResult.error?.message);
      return { publicKey: null, connected: false };
    }

    return { publicKey: addressResult.address, connected: true };
  } catch (err) {
    console.error("[walletService] Unexpected error:", err.message);
    return { publicKey: null, connected: false };
  }
}

/**
 * Get the current public key without triggering a connection popup.
 * Returns null if not connected.
 */
export async function getPublicKey() {
  try {
    const result = await getAddress();
    return result.error ? null : (result.address || null);
  } catch {
    return null;
  }
}

/**
 * Sign a transaction using Freighter
 * @param {string} txXdr - Transaction XDR string
 * @param {object} options - Signing options (network, networkPassphrase)
 * @returns {Promise<string>} Signed transaction XDR
 */
export async function signTransaction(txXdr, options = {}) {
  try {
    const result = await freighterSignTransaction(txXdr, options);
    
    if (result.error) {
      throw new Error(result.error.message || 'Transaction signing failed');
    }
    
    return result.signedTxXdr || result;
  } catch (error) {
    console.error("[walletService] signTransaction error:", error);
    throw error;
  }
}
