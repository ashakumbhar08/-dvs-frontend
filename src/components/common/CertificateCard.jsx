import { truncateWallet } from "../../utils/formatWallet"

export default function CertificateCard({ certificate, onClick }) {
  const date = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  })

  return (
    <div className="bg-gradient-to-br from-brand-50 to-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
          DVS
        </div>
        <span className="text-xs text-brand-600 font-medium">Verified Certificate</span>
      </div>
      <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug">{certificate.taskTitle}</h3>
      <div className="text-xs text-gray-500 space-y-1">
        <p>{certificate.userName}</p>
        <p>{date}</p>
        <p className="font-mono text-gray-400">{truncateWallet(certificate.certificateHash || certificate.userWallet)}</p>
      </div>
      <p className="text-xs text-gray-400">Issued by {certificate.issuerName}</p>
      <button
        onClick={() => onClick && onClick(certificate)}
        className="w-full py-2 text-sm font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors"
      >
        View
      </button>
    </div>
  )
}
