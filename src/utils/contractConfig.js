/**
 * Contract configuration utilities
 */

export const getContractConfig = () => {
  const certificateContractId = import.meta.env.VITE_CERTIFICATE_CONTRACT_ID;
  const rewardContractId = import.meta.env.VITE_REWARD_CONTRACT_ID;
  const network = import.meta.env.VITE_STELLAR_NETWORK || 'testnet';
  const rpcUrl = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

  return {
    certificateContractId,
    rewardContractId,
    network,
    rpcUrl,
    isConfigured: !!(certificateContractId && rewardContractId),
  };
};

export const isContractConfigured = () => {
  const config = getContractConfig();
  return config.isConfigured;
};

export const getConfigurationMessage = () => {
  const config = getContractConfig();
  
  if (config.isConfigured) {
    return {
      status: 'configured',
      message: 'Smart contracts are configured and ready',
    };
  }

  return {
    status: 'not_configured',
    message: 'Smart contracts not configured. Please set VITE_CERTIFICATE_CONTRACT_ID and VITE_REWARD_CONTRACT_ID in your .env file.',
  };
};
