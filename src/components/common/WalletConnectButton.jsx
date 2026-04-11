import { useState } from "react"
import { truncateWallet } from "../../utils/formatWallet"
import useAuthStore from "../../store/authStore"

export default function WalletConnectButton({ onConnect, onDisconnect }) {
  const { walletAddress, walletConnected, connectWallet, disconnectWallet } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    try {
      const addr = await connectWallet()
      if (onConnect && addr) onConnect(addr)
    } catch (err) {
      setError(err.message)
      console.error("WalletConnectButton:", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    setOpen(false)
    disconnectWallet()
    if (onDisconnect) onDisconnect()
  }

  if (walletConnected && walletAddress) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-800 text-sm rounded-lg hover:bg-brand-100 transition-colors"
        >
          <span className="w-2 h-2 bg-accent-400 rounded-full shrink-0" />
          {truncateWallet(walletAddress)}
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40 z-20">
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-60"
      >
        {loading ? "Connecting..." : "Connect Freighter Wallet"}
      </button>
      {error && (
        <p className="text-xs text-red-500 max-w-[220px]">{error}</p>
      )}
    </div>
  )
}
