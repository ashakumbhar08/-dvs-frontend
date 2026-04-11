import Modal from "../common/Modal"
import { useWallet } from "../../hooks/useWallet"
import { truncateAddress } from "../../utils/formatters"

export default function WalletModal({ isOpen, onClose, onConnected }) {
  const { walletAddress, walletConnected, connect, disconnect } = useWallet()

  const handleConnect = async () => {
    const result = await connect()
    if (result?.connected) {
      if (onConnected) onConnected(result.address)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Stellar Wallet">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Connect your Freighter wallet to sign transactions on the Stellar network.
        </p>
        {walletConnected ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">Wallet Connected</p>
            <p className="text-xs text-green-600 font-mono mt-1">{walletAddress}</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-3">Freighter wallet not connected</p>
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-800 transition-colors"
            >
              Connect Freighter Wallet
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400">
          Don't have Freighter?{" "}
          <a
            href="https://freighter.app"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          >
            Download here
          </a>
        </p>
      </div>
    </Modal>
  )
}
