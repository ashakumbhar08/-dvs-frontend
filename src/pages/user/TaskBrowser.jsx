import { useState, useMemo } from "react"
import UserLayout from "../../layouts/UserLayout"
import TaskCard from "../../components/common/TaskCard"
import EmptyState from "../../components/common/EmptyState"
import LoadingSkeleton from "../../components/common/LoadingSkeleton"
import { TASK_CATEGORIES } from "../../utils/constants"
import useTaskStore from "../../store/taskStore"

export default function TaskBrowser() {
  const { tasks } = useTaskStore()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("Newest")
  const [loading] = useState(false)

  const filtered = useMemo(() => {
    let result = [...tasks]
    if (search) result = result.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    if (category !== "All") result = result.filter((t) => t.category === category)
    if (status !== "All") result = result.filter((t) => t.status === status.toLowerCase())
    if (sort === "Newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === "Highest Reward") result.sort((a, b) => b.rewardXlm - a.rewardXlm)
    if (sort === "Expiring Soon") result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    return result
  }, [tasks, search, category, status, sort])

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">Find tasks that match your skills and earn XLM rewards.</p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-10 bg-gray-50 pb-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            <option>All</option>
            {TASK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {["All", "Active", "Paused", "Closed"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {["Newest", "Highest Reward", "Expiring Soon"].map((s) => <option key={s}>{s}</option>)}
          </select>
          {(search || category !== "All" || status !== "All") && (
            <button
              onClick={() => { setSearch(""); setCategory("All"); setStatus("All") }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} task{filtered.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        </>
      ) : (
        <EmptyState
          icon="🔍"
          title="No tasks found"
          description="Try adjusting your filters or search term."
          actionLabel="Clear Filters"
          onAction={() => { setSearch(""); setCategory("All"); setStatus("All") }}
        />
      )}
    </UserLayout>
  )
}
