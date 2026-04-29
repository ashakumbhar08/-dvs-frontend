import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout"
import LoadingSkeleton from "../components/common/LoadingSkeleton"
import StatusBadge from "../components/common/StatusBadge"
import { certificates } from "../utils/dummyData"
import { truncateAddress, formatXlm } from "../utils/formatters"

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("id") || "")
  const [result, setResult] = useState(null) // null | { valid, cert }
  const [loading, setLoading] = useState(false)

  const runVerify = useCallback(async (q) => {
    if (!q?.trim()) return
    setLoading(true)
    setResult(null)
    await new Promise((r) => setTimeout(r, 800))
    const cert = certificates.find(
      (c) => c.id === q.trim() || c.txHash === q.trim() || c.certificateHash === q.trim()
    )
    setResult({ valid: !!cert, cert: cert || null })
    setLoading(false)
  }, [])

  const verify = (q = query) => runVerify(q)

  // Auto-verify if ?id= param present on mount
  useEffect(() => {
    const id = searchParams.get("id")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) runVerify(id)
  }, [searchParams, runVerify])

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify a Certificate</h1>
          <p className="text-gray-500">Enter a certificate ID or transaction hash to verify authenticity.</p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify()}
            placeholder="cert_001 or transaction hash..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
          <button
            onClick={() => verify()}
            disabled={!query.trim() || loading}
            className="px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            Verify
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            <LoadingSkeleton variant="text" count={3} />
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <div className={`rounded-2xl border-2 p-6 ${result.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            {result.valid ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-lg">Certificate Valid</p>
                    <p className="text-green-600 text-sm">This certificate is authentic and on-chain.</p>
                  </div>
                  <StatusBadge status="valid" />
                </div>

                <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
                  {[
                    ["Task", result.cert.taskTitle],
                    ["Recipient", result.cert.userName],
                    ["Issued By", result.cert.issuerName],
                    ["Reward", formatXlm(result.cert.rewardXlm)],
                    ["Block", result.cert.blockNumber?.toLocaleString()],
                    ["Certificate ID", result.cert.id],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tx Hash</span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${result.cert.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 font-mono text-xs hover:underline"
                    >
                      {truncateAddress(result.cert.txHash)}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-800 text-lg">Certificate Not Found</p>
                  <p className="text-red-600 text-sm">No certificate found with this ID or hash.</p>
                </div>
                <StatusBadge status="invalid" />
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {!loading && !result && (
          <div className="text-center text-sm text-gray-400">
            <p>Try: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">cert_001</code></p>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
