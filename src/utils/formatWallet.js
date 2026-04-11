/**
 * Truncate a Stellar wallet address for display.
 * Default: GDVS7K...KOYQ  (6 start + 4 end)
 */
export function truncateWallet(address, start = 6, end = 4) {
  if (!address) return ""
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

/**
 * Truncate a transaction hash for display.
 * Default: TXN_B3F9...A1C2  (8 start + 6 end)
 */
export function truncateTxHash(hash, start = 8, end = 6) {
  if (!hash) return ""
  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}
