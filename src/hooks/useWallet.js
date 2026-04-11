import { connectWallet, disconnectWallet } from "../services/walletService"
import useAuthStore from "../store/authStore"
import useToastStore from "../store/toastStore"

export const useWallet = () => {
  const { walletAddress, walletConnected, setWallet } = useAuthStore()
  const show = useToastStore((s) => s.show)

  const connect = async () => {
    try {
      const result = await connectWallet()
      setWallet(result.address)
      show({ type: "success", message: "Wallet connected" })
      return result
    } catch {
      show({ type: "error", message: "Failed to connect wallet" })
    }
  }

  const disconnect = async () => {
    await disconnectWallet()
    setWallet(null)
    show({ type: "info", message: "Wallet disconnected" })
  }

  return { walletAddress, walletConnected, connect, disconnect }
}
