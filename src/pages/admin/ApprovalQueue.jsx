import { useState } from "react"
import AdminLayout from "../../layouts/AdminLayout"
import StatusBadge from "../../components/common/StatusBadge"
import Modal from "../../components/common/Modal"
import EmptyState from "../../components/common/EmptyState"
import useTaskStore from "../../store/taskStore"
import useToastStore from "../../store/toastStore"
import useAuthStore from "../../store/authStore"
import { approveSubmission, rejectSubmission } from "../../services/contractService"
import { timeAgo, truncateAddress, formatXlm } from "../../utils/formatters"

export default function ApprovalQueue() {
  const { submissions, tasks, updateSubmissionStatus, addCertificate } = useTaskStore()
  const showToast = useToastStore((s) => s.show)
  const { walletConnected } = useAuthStore()

  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [approveModal, setApproveModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const pendingSubmissions = submissions.filter((sub) => ["pending", "under_review"].includes(sub.status))
  const selectedSubmission = selectedId ? submissions.find((sub) => sub.id === selectedId) : null
  const relatedTask = selectedSubmission ? tasks.find((task) => task.id === selectedSubmission.taskId) : null

  const handleSelectSubmission = (id) => {
    setSelectedId(id)
    setShowRejectInput(false)
    setFeedback("")
  }

  const handleApprove = async () => {
    setLoading(true)
    try {
      const result = await approveSubmission({
        submissionId: selectedSubmission.id,
        userId: selectedSubmission.userId,
        rewardXlm: selectedSubmission.rewardXlm,
      })
      updateSubmissionStatus(selectedSubmission.id, "approved")
      addCertificate({
        id: result.certId,
        taskId: selectedSubmission.taskId,
        taskTitle: selectedSubmission.taskTitle,
        userId: selectedSubmission.userId,
        userName: selectedSubmission.userName,
        userWallet: selectedSubmission.userWallet,
        issuedBy: "admin_001",
        issuerName: "DVS Admin",
        issuedAt: new Date().toISOString(),
        rewardXlm: selectedSubmission.rewardXlm,
        txHash: result.txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 48000000,
        certificateHash: "0xDVS" + Math.random().toString(36).slice(2),
      })
      showToast({ type: "success", message: `Approved! Certificate issued to ${selectedSubmission.userName}.` })
      setApproveModal(false)
      setSelectedId(null)
    } catch {
      showToast({ type: "error", message: "Approval failed. Try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!feedback.trim()) return
    setLoading(true)
    try {
      await rejectSubmission({ submissionId: selectedSubmission.id, feedback })
      updateSubmissionStatus(selectedSubmission.id, "rejected", feedback)
      showToast({ type: "info", message: `Submission rejected with feedback.` })
      setShowRejectInput(false)
      setFeedback("")
      setSelectedId(null)
    } catch {
      showToast({ type: "error", message: "Rejection failed. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Approval Queue</h1>
        <p className="text-gray-500 text-sm mt-1">{pendingSubmissions.length} submission{pendingSubmissions.length !== 1 ? "s" : ""} awaiting review</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left panel */}
        <div className="w-80 shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          {pendingSubmissions.length === 0 ? (
            <div className="p-4">
              <EmptyState icon="✅" title="All reviewed!" description="No pending submissions." />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingSubmissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedId === sub.id ? "border-l-2 border-brand-600 bg-brand-50" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{sub.taskTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub.userName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{timeAgo(sub.submittedAt)}</span>
                    <StatusBadge status={sub.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          {!selectedSubmission ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState icon="👈" title="Select a submission" description="Click a submission on the left to review it." />
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Submitter info */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 font-bold">
                  {selectedSubmission.userName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedSubmission.userName}</p>
                  <p className="text-xs text-gray-400 font-mono">{selectedSubmission.userWallet}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={selectedSubmission.status} />
                </div>
              </div>

              {/* Task requirements */}
              {relatedTask?.proofRequirements && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Task Requirements</p>
                  <ul className="space-y-1">
                    {relatedTask.proofRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-brand-400 mt-0.5">☐</span>{req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submitted proof */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Submitted Proof</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedSubmission.proofText}
                </div>
              </div>

              {/* Files */}
              {selectedSubmission.files?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmission.files.map((f, i) => (
                      <span key={i} className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reward info */}
              <div className="bg-brand-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-400 font-medium">Reward to send</p>
                  <p className="text-xl font-bold text-brand-800">{formatXlm(selectedSubmission.rewardXlm)}</p>
                </div>
                <div className="text-right text-xs text-brand-400">
                  <p>Recipient: {truncateAddress(selectedSubmission.userWallet)}</p>
                  <p>Est. fee: ~0.00001 XLM</p>
                </div>
              </div>

              {/* Reject feedback input */}
              {showRejectInput && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Rejection Feedback</p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Explain why this submission is being rejected..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={!feedback.trim() || loading}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Confirm Rejection"}
                    </button>
                    <button
                      onClick={() => { setShowRejectInput(false); setFeedback("") }}
                      className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {!showRejectInput && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setApproveModal(true)}
                    className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Approve &amp; Issue Certificate
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    Reject with Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Approve confirmation modal */}
      <Modal
        isOpen={approveModal}
        onClose={() => setApproveModal(false)}
        title="Approve Submission"
        confirmLabel="Confirm & Sign"
        onConfirm={handleApprove}
        loading={loading}
      >
        {selectedSubmission && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You are approving <strong>{selectedSubmission.taskTitle}</strong> by <strong>{selectedSubmission.userName}</strong>.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
              <p>Reward: <strong className="text-gray-800">{formatXlm(selectedSubmission.rewardXlm)}</strong></p>
              <p>Recipient: <span className="font-mono">{selectedSubmission.userWallet}</span></p>
              <p>Est. fee: ~0.00001 XLM</p>
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
              This will mint a certificate and transfer XLM to the recipient.
            </p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
