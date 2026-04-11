import useAuthStore from "../store/authStore"

export const useAuth = () => {
  const { user, isAuthenticated, walletAddress, walletConnected, login, logout, signup, setWallet, loginAsAdmin } =
    useAuthStore()
  return { user, isAuthenticated, walletAddress, walletConnected, login, logout, signup, setWallet, loginAsAdmin }
}
