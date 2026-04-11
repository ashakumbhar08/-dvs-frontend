import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../utils/constants"
import useAuthStore from "../../store/authStore"
import useTaskStore from "../../store/taskStore"
import WalletConnectButton from "./WalletConnectButton"
import DVSLogo from "../DVSLogo"
import { currentUser as mockUser } from "../../data/mockData"
import { truncateWallet } from "../../utils/formatWallet"
import { useState } from "react"

export default function Navbar({ variant = "public" }) {
  const navigate = useNavigate()
  const { user, logout, walletAddress, walletConnected } = useAuthStore()
  const submissions = useTaskStore((s) => s.submissions)
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName  = user?.name || mockUser.displayName
  const rawWallet    = walletAddress || user?.walletAddress || mockUser.wallet
  const walletShort  = truncateWallet(rawWallet)
  const pendingCount = submissions.filter((s) => s.status === "pending").length

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between gap-2 overflow-hidden">

      {/* Left: logo */}
      <div className="flex items-center shrink-0">
        <DVSLogo />
      </div>

      {/* Right: PUBLIC */}
      {variant === "public" && (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to={ROUTES.LANDING} className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link to={ROUTES.VERIFY} className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Verify
          </Link>
          <Link to={ROUTES.LOGIN} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link
            to={ROUTES.SIGNUP}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors whitespace-nowrap"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Right: USER */}
      {variant === "user" && (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Wallet connected indicator — spec: text-green-500, bg-green-500 */}
          {walletConnected && (
            <span className="hidden md:flex items-center gap-1.5 text-xs text-green-500 font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Connected to Freighter
            </span>
          )}

          <WalletConnectButton />

          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-800 font-semibold text-xs shrink-0">
                {displayName[0]}
              </div>
              <span className="hidden sm:block text-sm truncate max-w-[100px]">{displayName}</span>
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-48 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5 overflow-hidden text-ellipsis">{walletShort}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right: ADMIN */}
      {variant === "admin" && (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {walletConnected && (
            <span className="hidden md:flex items-center gap-1.5 text-xs text-green-500 font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Connected to Freighter
            </span>
          )}

          <Link
            to={ROUTES.ADMIN_QUEUE}
            className="relative text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0"
          >
            Queue
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {pendingCount}
              </span>
            )}
          </Link>

          <WalletConnectButton />

          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 font-semibold text-xs shrink-0">
                {user?.name?.[0] || "A"}
              </div>
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-48 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
