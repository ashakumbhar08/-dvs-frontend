import { useState, useEffect } from 'react';
import { getContractConfig } from '../../services/contractService';

export default function ContractStatusBanner() {
  const [config, setConfig] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const contractConfig = getContractConfig();
    setConfig(contractConfig);
    
    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('contract-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('contract-banner-dismissed', 'true');
  };

  if (!config || config.isConfigured || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-900">
              Smart Contracts Not Yet Deployed
            </p>
            <p className="text-xs text-amber-700 mt-1">
              The Soroban smart contracts are implemented and ready, but need to be deployed to Stellar Testnet. 
              The app currently uses mock data for demonstration. 
              <a 
                href="https://github.com/ashakumbhar08/-dvs-frontend/blob/main/DEPLOYMENT.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-amber-900 ml-1"
              >
                View deployment guide →
              </a>
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-amber-600 hover:text-amber-900"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
