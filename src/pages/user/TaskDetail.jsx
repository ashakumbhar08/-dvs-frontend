import { useParams, useNavigate } from "react-router-dom"
import UserLayout from "../../layouts/UserLayout"
import StatusBadge from "../../components/common/StatusBadge"
import SubmissionForm from "../../components/forms/SubmissionForm"
import { formatXlm, formatUsd, deadlineCountdown } from "../../utils/formatters"
import useTaskStore from "../../store/taskStore"
import { ROUTES } from "../../utils/constants"

const timelineSteps = ["Posted", "Active", "Under Review", "Completed"]

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks } = useTaskStore()
  const task = tasks.find((t) => t.id === id)

  if (!task) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Task not found.</p>
          <button onClick={() => navigate(ROUTES.TASKS)} className="mt-4 text-brand-600 hover:underline text-sm">
            Back to Tasks
          </button>
        </div>
      </UserLayout>
    )
  }

  const activeStep = task.status === "active" ? 1 : task.status === "closed" ? 3 : 1

  return (
    <UserLayout>
      <button onClick={() => navigate(ROUTES.TASKS)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Back to Tasks
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-medium bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full">
                {task.category}
              </span>
              <StatusBadge status={task.status} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>{formatXlm(task.rewardXlm)} ({formatUsd(task.rewardUsd)})</span>
              <span>{deadlineCountdown(task.deadline)}</span>
              <span>{task.currentSubmissions}/{task.maxSubmissions} submissions</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Proof Requirements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Proof Requirements</h2>
            <ul className="space-y-2">
              {task.proofRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-brand-400 mt-0.5">☐</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <SubmissionForm task={task} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 lg:sticky lg:top-20 self-start">
          {/* Reward Card */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-5 text-white">
            <p className="text-brand-200 text-sm mb-1">Reward</p>
            <p className="text-3xl font-bold">{formatXlm(task.rewardXlm)}</p>
            <p className="text-brand-200 text-sm">{formatUsd(task.rewardUsd)}</p>
            <p className="text-xs text-brand-200 mt-3 border-t border-brand-600 pt-3">
              Locked until approval
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Task Timeline</h3>
            <div className="space-y-3">
              {timelineSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i <= activeStep ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {i <= activeStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm ${i <= activeStep ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Issuer Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Issuer</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 font-bold text-sm">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">DVS Admin</p>
                <p className="text-xs text-gray-400">12 tasks created</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
