import { useState } from "react"
import { useNavigate } from "react-router-dom"
import UserLayout from "../../layouts/UserLayout"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"
import useAuthStore from "../../store/authStore"
import useTaskStore from "../../store/taskStore"
import { ROUTES } from "../../utils/constants"
import { timeAgo, formatXlm } from "../../utils/formatters"

const TABS = ["All", "Pending", "Approved", "Rejected"]

export default function MySubmissions() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { submissions } = useTaskStore()
  const [tab, setTab] = useState("All")
  const [expanded, setExpanded] = useState(null)

  const mine = submissions.filter((s) => s.userId === (user?.id || "user_aryan"))
  const filtered = tab === "All" ? mine : mine.filter((s) => s.status === tab.toLowerCase())

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-gray-500 text-sm mt-1">Track the status of your submitted work.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              tab === t ? "bg-white text-gray-900 font-medium shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            {t !== "All" && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({mine.filter((s) => s.status === t.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📤"
          title="No submissions yet"
          description="Complete a task and submit your proof to see it here."
          actionLabel="Browse Tasks"
          onAction={() => navigate(ROUTES.TASKS)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.map((sub, i) => (
            <div key={sub.id} className={i > 0 ? "border-t border-gray-100" : ""}>
              {/* Row */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{sub.taskTitle}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(sub.submittedAt)}</p>
                </div>
                <StatusBadge status={sub.status} />
                <span className="text-sm font-medium text-gray-700">{formatXlm(sub.rewardXlm)}</span>
                <div className="flex gap-2">
                  <button className="text-xs text-brand-600 hover:underline">
                    {expanded === sub.id ? "Hide" : "View Details"}
                  </button>
                  {sub.status === "rejected" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(ROUTES.TASK_DETAIL(sub.taskId)) }}
                      className="text-xs text-amber-600 hover:underline"
                    >
                      Resubmit
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded panel */}
              {expanded === sub.id && (
                <div className="bg-gray-50 border-t border-gray-100 p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Submitted Proof</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.proofText}</p>
                  </div>
                  {sub.files?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {sub.files.map((f, j) => (
                          <span key={j} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {sub.adminFeedback && (
                    <div className={`rounded-lg p-3 ${sub.status === "rejected" ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"}`}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Admin Feedback</p>
                      <p className="text-sm text-gray-700">{sub.adminFeedback}</p>
                    </div>
                  )}
                  {sub.txHash && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Transaction Hash</p>
                      <p className="text-xs font-mono text-brand-600">{sub.txHash}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  )
}
