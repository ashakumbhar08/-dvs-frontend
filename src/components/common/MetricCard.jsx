export default function MetricCard({ label, value, accent = "text-brand-600", icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <span className={`text-2xl font-bold ${accent}`}>{value}</span>
    </div>
  )
}
