import { Link } from "react-router-dom"
import { useWallet } from "@/hooks/useWallet"
import { certificates, tasks, activityFeed } from "@/data/mockData"
import { truncateWallet } from "@/utils/formatWallet"
import DVSLogo from "@/components/DVSLogo"

const connectedUsers = [
  { wallet: "GDVS7KQU2XMXNRXQMBLFHWFPNQMVK3AZLZRXQPL4HYJWTFSBNE2KOYQ", joined: "2024-09-01", certificates: 3, status: "active" },
  { wallet: "GBXYZ9KSTELLAR2024VERIFIERNODE1HYJWTFSBNE3KOYQZXPL4HA",   joined: "2024-09-12", certificates: 1, status: "active" },
  { wallet: "GCDEF3STELLAR2025USERNODE2WTFSBNE3KOYQZXPL4HAJWTFSBQ",    joined: "2024-10-03", certificates: 0, status: "pending" },
]

const typeBadgeColor = {
  task_created:       "bg-blue-900 text-blue-300",
  proof_submitted:    "bg-indigo-900 text-indigo-300",
  certificate_minted: "bg-teal-900 text-teal-300",
  reward_sent:        "bg-green-900 text-green-300",
  account_created:    "bg-gray-700 text-gray-300",
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

function MetricCard({ label, value }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function AdminPanel() {
  const { truncated, disconnectWallet } = useWallet()

  const certsIssued   = certificates.length
  const tasksComplete = tasks.filter((t) => t.status === "completed").length
  const pendingReview = certificates.filter((c) => c.status === "pending").length
  const recentFeed    = [...activityFeed]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 md:px-6 py-3 flex items-center justify-between">
        <DVSLogo />
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {truncated}
          </span>
          <button
            onClick={disconnectWallet}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-medium text-gray-100">Admin Panel</h1>
          <span className="text-xs text-gray-400">DVS Network — Operator View</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Wallets Connected" value={connectedUsers.length} />
          <MetricCard label="Certificates Issued"     value={certsIssued} />
          <MetricCard label="Tasks Completed"         value={tasksComplete} />
          <MetricCard label="Pending Reviews"         value={pendingReview} />
        </div>

        {/* Connected Users table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-gray-100">Connected Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-750 border-b border-gray-700">
                <tr>
                  {["Wallet Address", "Joined", "Certificates", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {connectedUsers.map((u) => (
                  <tr key={u.wallet} className="hover:bg-gray-750 transition-colors">
                    <td className="px-5 py-3 font-mono text-gray-300 text-xs">{truncateWallet(u.wallet)}</td>
                    <td className="px-5 py-3 text-gray-400">{u.joined}</td>
                    <td className="px-5 py-3 text-gray-300">{u.certificates}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.status === "active"
                          ? "bg-green-900 text-green-300"
                          : "bg-amber-900 text-amber-300"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-gray-100">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {recentFeed.map((evt) => (
              <div key={evt.id} className="flex items-start gap-4 px-5 py-4">
                <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5 w-24 shrink-0">
                  {fmtDate(evt.timestamp)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${typeBadgeColor[evt.type] || "bg-gray-700 text-gray-300"}`}>
                  {evt.type.replace(/_/g, " ")}
                </span>
                <p className="text-sm text-gray-300 leading-snug">{evt.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
