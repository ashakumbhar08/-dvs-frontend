import { useState } from "react"
import { TASK_CATEGORIES, TASK_STATUS } from "../../utils/constants"
import useTaskStore from "../../store/taskStore"
import useToastStore from "../../store/toastStore"

export default function TaskForm({ task = null, onDone }) {
  const { addTask, updateTask } = useTaskStore()
  const show = useToastStore((s) => s.show)
  const isEdit = !!task

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    category: task?.category || TASK_CATEGORIES[0],
    rewardXlm: task?.rewardXlm || "",
    deadline: task?.deadline ? task.deadline.slice(0, 10) : "",
    maxSubmissions: task?.maxSubmissions || 5,
    proofRequirements: task?.proofRequirements || [""],
    status: task?.status || TASK_STATUS.DRAFT,
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const addReq = () => set("proofRequirements", [...form.proofRequirements, ""])
  const removeReq = (i) => set("proofRequirements", form.proofRequirements.filter((_, j) => j !== i))
  const updateReq = (i, val) =>
    set("proofRequirements", form.proofRequirements.map((r, j) => (j === i ? val : r)))

  const handleSubmit = (status) => {
    const data = {
      ...form,
      status,
      rewardXlm: Number(form.rewardXlm),
      rewardUsd: (Number(form.rewardXlm) * 0.083).toFixed(2),
      maxSubmissions: Number(form.maxSubmissions),
      currentSubmissions: task?.currentSubmissions || 0,
      deadline: new Date(form.deadline).toISOString(),
      proofRequirements: form.proofRequirements.filter(Boolean),
    }
    if (isEdit) {
      updateTask(task.id, data)
      show({ type: "success", message: "Task updated!" })
    } else {
      addTask({ id: "task_" + Date.now(), createdBy: "admin_001", createdAt: new Date().toISOString(), ...data })
      show({ type: "success", message: "Task created!" })
    }
    if (onDone) onDone()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h3 className="font-semibold text-gray-900">{isEdit ? "Edit Task" : "Create New Task"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="Task title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 resize-none"
            placeholder="Describe the task in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {TASK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reward (XLM)</label>
          <input
            type="number"
            value={form.rewardXlm}
            onChange={(e) => set("rewardXlm", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Submissions</label>
          <input
            type="number"
            value={form.maxSubmissions}
            onChange={(e) => set("maxSubmissions", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Proof Requirements</label>
          <button onClick={addReq} type="button" className="text-xs text-brand-600 hover:underline">+ Add</button>
        </div>
        <div className="space-y-2">
          {form.proofRequirements.map((req, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={req}
                onChange={(e) => updateReq(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder={`Requirement ${i + 1}`}
              />
              {form.proofRequirements.length > 1 && (
                <button onClick={() => removeReq(i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleSubmit(TASK_STATUS.DRAFT)}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit(TASK_STATUS.ACTIVE)}
          className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-800 transition-colors"
        >
          {isEdit ? "Save & Publish" : "Publish Task"}
        </button>
        {onDone && (
          <button
            onClick={onDone}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
