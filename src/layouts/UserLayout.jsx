import { Navigate } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import Sidebar from "../components/common/Sidebar"
import Toast from "../components/common/Toast"
import useAuthStore from "../store/authStore"
import { ROUTES } from "../utils/constants"

export default function UserLayout({ children }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || user?.role !== "user") {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar variant="user" />
      <div className="flex flex-1">
        <Sidebar role="user" />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
      <Toast />
    </div>
  )
}
