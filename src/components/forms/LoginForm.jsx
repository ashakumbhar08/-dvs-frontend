import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ROUTES, ROLES } from "../../utils/constants"
import useAuthStore from "../../store/authStore"
import useToastStore from "../../store/toastStore"
import WalletConnectButton from "../common/WalletConnectButton"

export default function LoginForm({ mode = "login" }) {
  const navigate = useNavigate()
  const { login, signup, walletConnected } = useAuthStore()
  const show = useToastStore((s) => s.show)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(ROLES.USER)
  const [loading, setLoading] = useState(false)

  const isSignup = mode === "signup"
  const canSubmit = isSignup ? (email && password && walletConnected) : (email && password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      if (isSignup) {
        signup({ email, role })
        show({ type: "success", message: "Account created!" })
        navigate(role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.DASHBOARD)
      } else {
        login({ email })
        const user = useAuthStore.getState().user
        show({ type: "success", message: `Welcome back, ${user?.name}!` })
        navigate(user?.role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.DASHBOARD)
      }
    } catch {
      show({ type: "error", message: "Something went wrong. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isSignup && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">I want to...</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: ROLES.USER, label: "Complete Tasks", icon: "🎯", desc: "Earn XLM rewards" },
              { value: ROLES.ADMIN, label: "Manage Tasks", icon: "🛠️", desc: "Create & review tasks" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === r.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{r.icon}</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{r.label}</p>
                <p className="text-xs text-gray-500">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>

      {isSignup && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Stellar Wallet (required)</p>
          <WalletConnectButton />
          {!walletConnected && (
            <p className="text-xs text-amber-600 mt-1">Connect your wallet to continue</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="w-full py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-500">
        {isSignup ? (
          <>Already have an account?{" "}<Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">Sign In</Link></>
        ) : (
          <>New here?{" "}<Link to={ROUTES.SIGNUP} className="text-brand-600 hover:underline">Sign Up</Link></>
        )}
      </p>
    </form>
  )
}
