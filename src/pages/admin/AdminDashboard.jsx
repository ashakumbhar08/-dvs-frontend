import { useNavigate } from "react-router-dom"
import AdminLayout from "../../layouts/AdminLayout"
import MetricCard from "../../components/common/MetricCard"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"
import useTaskStore from "../../store/taskStore"
import { ROUTES } from "../../utils/constants"
import { timeAgo, formatXlm } from "../../utils/formatters"
import { activityFeed, stats, users } from "../../data/mockData"

const activityDot = {
  certificate_minted: "bg-brand-500",
  reward_sent: "bg-green-500",
  proof_submitted: "bg-blue-500",
  task_created: "bg-brand-500",
  submission_approved: "bg-green-500",
  submission_rejected: "bg-red-500",
  user_joined: "bg-gray-400",
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { tasks, submissions, certificates } = useTaskStore()

  const openTasks = tasks.filter((t) => t.status === "active").length
  const pendingReviews = submissions.filter((s) => s.status === "pending").length
  const rewardsDisbursed = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + s.rewardXlm, 0)
  const activeUsers = users.filter((u) => u.role === "user").length
  const certsIssued = certificates.length
  const lowPool = stats.poolBalance < 300
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").slice(0, 5)

  return (
    <AdminLayout>
      {/* Low pool alert */}
      {lowPool && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Reward Pool Low</p>
            <p className="text-sm text-amber-600">
              Pool balance is {formatXlm(stats.poolBalance)} — below the 300 XLM threshold. Top up soon.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of the DVS platform.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard label="Open Tasks" value={openTasks} accent="text-teal-600" />
        <MetricCard label="Pending Reviews" value={pendingReviews} accent="text-amber-600" />
        <MetricCard label="Rewards Disbursed" value={formatXlm(rewardsDisbursed)} accent="text-green-600" />
        <MetricCard label="Active Users" value={activeUsers} accent="text-brand-600" />
        <MetricCard label="Certs Issued" value={certsIssued} accent="text-brand-600" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Approval Queue Preview */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Pending Reviews</h2>
            <button
              onClick={() => navigate(ROUTES.ADMIN_QUEUE)}
              className="text-sm text-brand-600 hover:underline"
            >
              View All
            </button>
          </div>
          {pendingSubmissions.length === 0 ? (
            <div className="p-5">
              <EmptyState title="All caught up" description="No pending submissions." />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{sub.taskTitle}</p>
                    <p className="text-xs text-gray-400">{sub.userName} · {timeAgo(sub.submittedAt)}</p>
                  </div>
                  <StatusBadge status={sub.status} />
                  <button
                    onClick={() => navigate(ROUTES.ADMIN_QUEUE)}
                    className="text-xs text-brand-600 hover:underline whitespace-nowrap"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Live Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {activityFeed.slice(0, 6).map((evt) => (
              <div key={evt.id} className="flex gap-3 p-4 items-start">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activityDot[evt.type] || "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{evt.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(evt.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Tasks Completed (Last 6 Months)</h2>
        <div className="flex items-end gap-3 h-32">
          {[
            { month: "Nov", count: 4 },
            { month: "Dec", count: 7 },
            { month: "Jan", count: 5 },
            { month: "Feb", count: 12 },
            { month: "Mar", count: 9 },
            { month: "Apr", count: 14 },
          ].map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500 font-medium">{d.count}</span>
              <div
                className="w-full bg-brand-500 rounded-t-md"
                style={{ height: `${(d.count / 14) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
