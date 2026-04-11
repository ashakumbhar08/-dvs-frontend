import Navbar from "../components/common/Navbar"
import Toast from "../components/common/Toast"

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar variant="public" />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        © 2026 DVS — Decentralized Verification System
      </footer>
      <Toast />
    </div>
  )
}
