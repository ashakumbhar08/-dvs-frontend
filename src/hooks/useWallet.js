import useWalletStore from "@/store/useWalletStore"
import { truncateWallet } from "@/utils/formatWallet"

export function useWallet() {
  const {
    walletAddress,
    walletConnected,
    isAdmin,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWalletStore()

  const truncated = truncateWallet(walletAddress)

  return {
    walletAddress,
    walletConnected,
    isAdmin,
    isConnecting,
    connectWallet,
    disconnectWallet,
    truncated,
  }
}
