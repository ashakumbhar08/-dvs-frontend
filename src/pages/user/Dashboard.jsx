import { useNavigate } from "react-router-dom"
import UserLayout from "../../layouts/UserLayout"
import MetricCard from "../../components/common/MetricCard"
import TaskCard from "../../components/common/TaskCard"
import CertificateCard from "../../components/common/CertificateCard"
import useAuthStore from "../../store/authStore"
import useTaskStore from "../../store/taskStore"
import { ROUTES } from "../../utils/constants"
import { activityFeed, currentUser as mockUser } from "../../data/mockData"
import { truncateWallet, truncateTxHash } from "../../utils/formatWallet"

const activityDot = {
  task_created:       "bg-brand-400",
  proof_submitted:    "bg-blue-500",
  certificate_minted: "bg-brand-600",
  reward_sent:        "bg-green-500",
  account_created:    "bg-gray-400",
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, walletAddress } = useAuthStore()
  const { tasks, submissions, certificates } = useTaskStore()

  const displayName  = user?.name || mockUser.displayName
  const rawWallet    = walletAddress || user?.walletAddress || mockUser.wallet
  const totalXP      = user?.totalXP ?? mockUser.totalXP
  const level        = user?.level   ?? mockUser.level

  const completedTasks = tasks.filter((t) => t.status === "completed")
  const activeTasks    = tasks.filter((t) => t.status === "active" || t.status === "in_progress").slice(0, 3)
  const recentCerts    = certificates.filter((c) => c.status === "verified").slice(0, 3)
  const pendingCount   = submissions.filter((s) => s.userId === (user?.id || "user_aryan") && s.status === "pending").length

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const feed     = [...activityFeed].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return (
    <UserLayout>
      {/* Greeting */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 md:p-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {displayName.split(" ")[0]}</h1>
          <p className="text-sm text-gray-400 font-mono mt-0.5 overflow-hidden text-ellipsis">{truncateWallet(rawWallet)}</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.TASKS)}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors self-start sm:self-auto"
        >
          Browse Tasks
        </button>
      </div>

      {/* Metrics — Task 7: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <MetricCard label="Tasks Completed"    value={completedTasks.length}             accent="text-brand-600" />
        <MetricCard label="Active Submissions" value={pendingCount}                       accent="text-amber-600" />
        <MetricCard label="Certificates"       value={recentCerts.length}                accent="text-brand-600" />
        <MetricCard label={"Level " + level}   value={totalXP.toLocaleString() + " XP"} accent="text-green-600" />
      </div>

      {/* Task 6 — blockchain tagline, once, directly after metrics */}
      <p className="text-xs text-center text-gray-400 mt-4 mb-8 tracking-wide">
        All certificates are securely recorded on the Stellar blockchain.
      </p>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Tasks panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Active Tasks</h2>
              <button onClick={() => navigate(ROUTES.TASKS)} className="text-sm text-brand-600 hover:underline">View all</button>
            </div>
            {activeTasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No tasks completed yet.</p>
            )}
          </div>

          {/* Certificates panel — Task 7: grid-cols-1 md:grid-cols-2 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Certificates</h2>
              <button onClick={() => navigate(ROUTES.MY_CERTIFICATES)} className="text-sm text-brand-600 hover:underline">View all</button>
            </div>
            {recentCerts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentCerts.map((cert) => (
                  <CertificateCard key={cert.id} certificate={cert} onClick={() => navigate(ROUTES.MY_CERTIFICATES)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No certificates issued yet.</p>
            )}
          </div>
        </div>

        {/* Activity feed — full width on mobile, no horizontal overflow */}
        <div className="w-full">
          <h2 className="font-semibold text-gray-900 mb-4">Activity Feed</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {feed.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
            ) : (
              feed.slice(-8).map((evt) => (
                <div key={evt.id} className="flex gap-3 p-4 items-start">
                  <span className={"w-2 h-2 rounded-full mt-1.5 shrink-0 " + (evt.status === "pending" ? "bg-amber-400" : (activityDot[evt.type] || "bg-gray-300"))} />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm text-gray-700 leading-snug">{evt.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(evt.timestamp)}</p>
                    {evt.txHash && (
                      <p className="text-xs text-brand-400 font-mono mt-0.5 truncate">{truncateTxHash(evt.txHash)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="mt-8 bg-brand-600 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg">Ready to earn more?</h3>
          <p className="text-brand-200 text-sm">Browse all available tasks and start earning XLM.</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.TASKS)}
          className="px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap shrink-0"
        >
          Browse Tasks
        </button>
      </div>
    </UserLayout>
  )
}
