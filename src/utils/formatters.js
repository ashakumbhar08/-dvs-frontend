export const truncateAddress = (addr) =>
  addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ""

export const formatXlm = (amount) =>
  `${Number(amount).toLocaleString()} XLM`

export const formatUsd = (amount) =>
  `~$${Number(amount).toFixed(2)}`

export const timeAgo = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days !== 1 ? "s" : ""} ago`
}

export const deadlineCountdown = (isoString) => {
  const diff = new Date(isoString).getTime() - Date.now()
  if (diff <= 0) return "Expired"
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  return `${days} day${days !== 1 ? "s" : ""} left`
}

export const deadlineDays = (isoString) => {
  const diff = new Date(isoString).getTime() - Date.now()
  return Math.floor(diff / 86400000)
}
