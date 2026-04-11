import { create } from "zustand"
import { persist } from "zustand/middleware"
import { users, currentUser as mockCurrentUser } from "../data/mockData"
import { connectWallet as connectFreighter, disconnectWallet as disconnectFreighter } from "../utils/freighter"

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      walletAddress: null,
      walletConnected: false,

      login: (credentials) => {
        // Match by email, fall back to the mock current user for demo
        const found = users.find((u) => u.email === credentials.email)
        const user = found
          ? { ...found, name: found.name, totalXlmEarned: found.totalXlmEarned }
          : {
              id:                mockCurrentUser.wallet,
              name:              mockCurrentUser.displayName,
              email:             credentials.email,
              role:              "user",
              walletAddress:     mockCurrentUser.wallet,
              tasksCompleted:    3,
              certificatesCount: 4,
              totalXlmEarned:    650,
              totalXP:           mockCurrentUser.totalXP,
              level:             mockCurrentUser.level,
            }
        set({ user, isAuthenticated: true })
      },

      signup: (data) => {
        const newUser = {
          id: `user_${Date.now()}`,
          name: data.name || data.email.split("@")[0],
          email: data.email,
          role: data.role || "user",
          walletAddress: data.walletAddress || null,
          tasksCompleted: 0,
          certificatesCount: 0,
          totalXlmEarned: 0,
          joinedAt: new Date().toISOString(),
          status: "active",
        }
        set({ user: newUser, isAuthenticated: true })
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          walletAddress: null,
          walletConnected: false,
        }),

      setWallet: (address) =>
        set({ walletAddress: address, walletConnected: !!address }),

      // Freighter wallet connection
      connectWallet: async () => {
        try {
          console.log("[authStore] Connecting wallet...")
          const publicKey = await connectFreighter()
          console.log("[authStore] Connected:", publicKey)
          set({
            walletAddress: publicKey,
            walletConnected: true,
          })
          return publicKey
        } catch (err) {
          console.error("[authStore] connectWallet failed:", err.message)
          throw err
        }
      },

      disconnectWallet: () => {
        disconnectFreighter()
        set({ walletAddress: null, walletConnected: false })
      },

      // Dev helper: login as admin
      loginAsAdmin: () => {
        const admin = users.find((u) => u.role === "admin")
        set({ user: admin, isAuthenticated: true })
      },
    }),
    { name: "dvs-auth" }
  )
)

export default useAuthStore
