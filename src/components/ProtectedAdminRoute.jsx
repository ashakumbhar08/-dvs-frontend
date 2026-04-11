import { Navigate } from "react-router-dom"
import { useWallet } from "@/hooks/useWallet"

export function ProtectedAdminRoute({ children }) {
  const { walletConnected, isAdmin } = useWallet()

  if (!walletConnected) return <Navigate to="/" replace />
  if (!isAdmin)         return <Navigate to="/" replace />

  return children
}
