import { useState } from "react"
import Modal from "../common/Modal"
import WalletConnectButton from "../common/WalletConnectButton"
import useAuthStore from "../../store/authStore"
import useTaskStore from "../../store/taskStore"
import useToastStore from "../../store/toastStore"
import { submitProof } from "../../services/contractService"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../utils/constants"

export default function SubmissionForm({ task }) {
  const navigate = useNavigate()
  const { user, walletConnected } = useAuthStore()
  const addSubmission = useTaskStore((s) => s.addSubmission)
  const show = useToastStore((s) => s.show)

  const [proofText, setProofText] = useState("")
  const [files, setFiles] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const result = await submitProof({ taskId: task.id, proofText, userId: user?.id })
      addSubmission({
        id: "sub_" + Date.now(),
        taskId: task.id,
        taskTitle: task.title,
        userId: user?.id,
        userName: user?.name,
        userWallet: user?.walletAddress,
        proofText,
        files: files.map((f) => f.name),
        status: "pending",
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        adminFeedback: null,
        rewardXlm: task.rewardXlm,
        txHash: result.txHash,
      })
      show({ type: "success", message: "Proof submitted successfully!" })
      setModalOpen(false)
      navigate(ROUTES.MY_SUBMISSIONS)
    } catch {
      show({ type: "error", message: "Submission failed. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Submit Your Proof</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          rows={5}
          placeholder="Describe your work, include links, contract addresses, etc."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setFiles([...files, ...Array.from(e.dataTransfer.files)])
          }}
          onClick={() => document.getElementById("file-input").click()}
        >
          <p className="text-sm text-gray-500">Drag & drop files here, or click to browse</p>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded">
                <span>📎 {f.name}</span>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!walletConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700 mb-2">Connect your wallet to submit</p>
          <WalletConnectButton />
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        disabled={!proofText || !walletConnected}
        className="w-full py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit for Review
      </button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Submission"
        confirmLabel="Confirm & Sign"
        onConfirm={handleConfirm}
        loading={loading}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            You are submitting proof for: <strong>{task.title}</strong>
          </p>
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
            <p>Gas estimate: ~0.00001 XLM</p>
            <p>Reward if approved: {task.rewardXlm} XLM</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">This action cannot be undone.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
