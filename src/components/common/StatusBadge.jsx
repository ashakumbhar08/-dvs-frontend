const colorMap = {
  pending: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  minted: "bg-brand-100 text-brand-800",
  active: "bg-teal-100 text-teal-700",
  closed: "bg-gray-100 text-gray-600",
  draft: "bg-gray-100 text-gray-600",
  paused: "bg-orange-100 text-orange-700",
  valid: "bg-green-100 text-green-700",
  invalid: "bg-red-100 text-red-700",
}

const labelMap = {
  under_review: "Under Review",
}

export default function StatusBadge({ status }) {
  const color = colorMap[status] || "bg-gray-100 text-gray-600"
  const label = labelMap[status] || status?.replace(/_/g, " ")
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {label}
    </span>
  )
}
