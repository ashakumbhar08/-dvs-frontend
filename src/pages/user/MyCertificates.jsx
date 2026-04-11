import { useState } from "react"
import UserLayout from "../../layouts/UserLayout"
import CertificateCard from "../../components/common/CertificateCard"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"
import Modal from "../../components/common/Modal"
import useAuthStore from "../../store/authStore"
import useTaskStore from "../../store/taskStore"
import useToastStore from "../../store/toastStore"
import { ROUTES } from "../../utils/constants"
import { useNavigate } from "react-router-dom"

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const truncateTx = (hash) =>
  hash ? hash.slice(0, 8) + "..." + hash.slice(-6) : "—"

const truncateAddr = (addr) =>
  addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "—"

export default function MyCertificates() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { certificates } = useTaskStore()
  const show = useToastStore((s) => s.show)
  const [selected, setSelected] = useState(null)

  const mine = certificates.filter((c) => c.userId === (user?.id || "user_aryan"))

  const copyLink = (certId) => {
    navigator.clipboard.writeText(`${window.location.origin}${ROUTES.VERIFY}?id=${certId}`)
    show({ type: "success", message: "Verification link copied!" })
  }

  const sharePortfolio = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.id}`)
    show({ type: "success", message: "Portfolio link copied!" })
  }

  return (
    <UserLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">{mine.length} certificate{mine.length !== 1 ? "s" : ""} earned</p>
        </div>
        {mine.length > 0 && (
          <button
            onClick={sharePortfolio}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Share Portfolio
          </button>
        )}
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon="🏆"
          title="No certificates yet"
          description="Complete your first task to earn a certificate."
          actionLabel="Browse Tasks"
          onAction={() => navigate(ROUTES.TASKS)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mine.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Certificate Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Certificate Details"
      >
        {selected && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-brand-50 to-brand-50 border border-brand-100 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                DVS
              </div>
              <p className="text-xs text-brand-400 font-medium mb-1">VERIFIED CERTIFICATE</p>
              <h3 className="font-bold text-gray-900">{selected.taskTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">{selected.userName}</p>
            </div>

            <div className="space-y-2 text-sm">
              {[
                ["Certificate ID", selected.id],
                ["Task",           selected.taskTitle],
                ["Issued By",      selected.issuerName],
                ["Issued",         fmtDate(selected.issuedAt)],
                ["Reward",         selected.rewardXlm ? selected.rewardXlm + " XLM" : "—"],
                ["Block",          selected.blockNumber?.toLocaleString() || "—"],
                ["Recipient",      truncateAddr(selected.userWallet)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={selected.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tx Hash</span>
                {selected.txHash ? (
                  <a
                    href={"https://stellar.expert/explorer/testnet/tx/" + selected.txHash}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 font-mono text-xs hover:underline"
                  >
                    {truncateTx(selected.txHash)}
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs">Pending</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { copyLink(selected.id); setSelected(null) }}
                className="flex-1 py-2 text-sm border border-brand-200 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Copy Verification Link
              </button>
              <button
                onClick={() => console.log("Download PDF placeholder")}
                className="flex-1 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </UserLayout>
  )
}
