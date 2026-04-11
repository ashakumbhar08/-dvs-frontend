import { create } from "zustand"
import { persist } from "zustand/middleware"
import { connectFreighter } from "@/services/walletService"

// Add real admin wallet addresses here
const ADMIN_WALLETS = [
  "GDVS7KQU2XMXNRXQMBLFHWFPNQMVK3AZLZRXQPL4HYJWTFSBNE2KOYQ",
]

const useWalletStore = create(
  persist(
    (set) => ({
      walletAddress:   null,
      walletConnected: false,
      isAdmin:         false,
      isConnecting:    false,

      connectWallet: async () => {
        set({ isConnecting: true })
        const result = await connectFreighter()
        set({
          walletAddress:   result.publicKey,
          walletConnected: result.connected,
          isAdmin:         ADMIN_WALLETS.includes(result.publicKey),
          isConnecting:    false,
        })
        return result.publicKey
      },

      disconnectWallet: () =>
        set({
          walletAddress:   null,
          walletConnected: false,
          isAdmin:         false,
          isConnecting:    false,
        }),
    }),
    { name: "dvs-wallet" }
  )
)

export default useWalletStore
