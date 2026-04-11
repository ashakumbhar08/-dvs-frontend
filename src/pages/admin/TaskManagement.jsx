import { useState } from "react"
import AdminLayout from "../../layouts/AdminLayout"
import StatusBadge from "../../components/common/StatusBadge"
import Modal from "../../components/common/Modal"
import TaskForm from "../../components/forms/TaskForm"
import EmptyState from "../../components/common/EmptyState"
import useTaskStore from "../../store/taskStore"
import useToastStore from "../../store/toastStore"
import { formatXlm, deadlineCountdown } from "../../utils/formatters"
import { TASK_STATUS } from "../../utils/constants"

export default function TaskManagement() {
  const { tasks, updateTaskStatus, deleteTask } = useTaskStore()
  const show = useToastStore((s) => s.show)

  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || t.status === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  const handleToggleStatus = (task) => {
    const next = task.status === TASK_STATUS.ACTIVE ? TASK_STATUS.PAUSED : TASK_STATUS.ACTIVE
    updateTaskStatus(task.id, next)
    show({ type: "success", message: `Task ${next === TASK_STATUS.ACTIVE ? "activated" : "paused"}.` })
  }

  const handleDelete = () => {
    deleteTask(deleteTarget.id)
    show({ type: "success", message: "Task deleted." })
    setDeleteTarget(null)
  }

  const openEdit = (task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditTask(null)
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 text-sm mt-1">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => { setEditTask(null); setShowForm(true) }}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors"
        >
          + Create New Task
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <TaskForm task={editTask} onDone={closeForm} />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        >
          {["All", "Active", "Draft", "Paused", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon="📋" title="No tasks found" description="Create your first task to get started." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Task Name", "Category", "Reward", "Submissions", "Status", "Deadline", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{task.title}</td>
                    <td className="px-4 py-3 text-gray-500">{task.category}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatXlm(task.rewardXlm)}</td>
                    <td className="px-4 py-3 text-gray-500">{task.currentSubmissions}/{task.maxSubmissions}</td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{deadlineCountdown(task.deadline)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(task)}
                          className="text-xs text-brand-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className="text-xs text-amber-600 hover:underline"
                        >
                          {task.status === TASK_STATUS.ACTIVE ? "Pause" : "Activate"}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(task)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Task"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isDanger
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
        </p>
      </Modal>
    </AdminLayout>
  )
}
