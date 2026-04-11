import { useNavigate } from "react-router-dom"
import { formatXlm, formatUsd, deadlineCountdown, deadlineDays } from "../../utils/formatters"
import { ROUTES } from "../../utils/constants"
import StatusBadge from "./StatusBadge"

export default function TaskCard({ task, onClick }) {
  const navigate = useNavigate()
  const days = deadlineDays(task.deadline)
  const pillColor =
    days > 7 ? "bg-green-100 text-green-700" :
    days > 3 ? "bg-amber-100 text-amber-700" :
    "bg-red-100 text-red-700"

  const handleClick = () => {
    if (onClick) onClick(task)
    else navigate(ROUTES.TASK_DETAIL(task.id))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full">
          {task.category}
        </span>
        <StatusBadge status={task.status} />
      </div>
      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">{task.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">{formatXlm(task.rewardXlm)}</p>
          <p className="text-xs text-gray-400">{formatUsd(task.rewardUsd)}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${pillColor}`}>
          {deadlineCountdown(task.deadline)}
        </span>
      </div>
      <button
        onClick={handleClick}
        className="w-full py-2 text-sm font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
      >
        View Task
      </button>
    </div>
  )
}
