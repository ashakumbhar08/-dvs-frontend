import { Navigate } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import Sidebar from "../components/common/Sidebar"
import Toast from "../components/common/Toast"
import ContractStatusBanner from "../components/common/ContractStatusBanner"
import useAuthStore from "../store/authStore"
import { ROUTES } from "../utils/constants"

export default function AdminLayout({ children }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar variant="admin" />
      <ContractStatusBanner />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <Toast />
    </div>
  )
}
