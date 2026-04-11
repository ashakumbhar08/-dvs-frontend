function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex gap-4 items-center p-4 border-b border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/5" />
      <div className="h-4 bg-gray-200 rounded w-1/6" />
      <div className="h-6 bg-gray-200 rounded-full w-16 ml-auto" />
    </div>
  )
}

function SkeletonText() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-3 bg-gray-200 rounded w-4/6" />
    </div>
  )
}

export default function LoadingSkeleton({ variant = "card", count = 1 }) {
  const Component = variant === "card" ? SkeletonCard : variant === "row" ? SkeletonRow : SkeletonText
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  )
}
