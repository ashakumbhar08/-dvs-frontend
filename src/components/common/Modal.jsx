import { useEffect } from "react"

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = "Confirm",
  onConfirm,
  isDanger = false,
  loading = false,
}) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose()
    if (isOpen) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <div className="mb-6">{children}</div>
        {onConfirm && (
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-60 ${
                isDanger ? "bg-red-600 hover:bg-red-700" : "bg-brand-600 hover:bg-brand-800"
              }`}
            >
              {loading ? "Processing..." : confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
