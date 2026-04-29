// Stellar SDK is loaded lazily to avoid crashing the browser on startup.
// It uses Node.js built-ins that require dynamic import in a Vite/browser context.

const NETWORK = import.meta.env.VITE_STELLAR_NETWORK || 'testnet';
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const CERTIFICATE_CONTRACT_ID = import.meta.env.VITE_CERTIFICATE_CONTRACT_ID;
const REWARD_CONTRACT_ID = import.meta.env.VITE_REWARD_CONTRACT_ID;

/**
 * Lazily load Stellar SDK — only when a contract call is made.
 */
async function getStellarSDK() {
  const SDK = await import('@stellar/stellar-sdk');
  return SDK;
}

/**
 * Get the current connected wallet public key from Freighter.
 */
async function getWalletPublicKey() {
  const { getAddress } = await import('@stellar/freighter-api');
  const result = await getAddress();
  if (result.error || !result.address) {
    throw new Error('Wallet not connected. Please connect your Freighter wallet first.');
  }
  return result.address;
}

/**
 * Check if contracts are configured and provide helpful error message.
 */
function checkContractConfiguration() {
  if (!CERTIFICATE_CONTRACT_ID || !REWARD_CONTRACT_ID) {
    const message = 
      '⚠️ Smart contracts not yet deployed.\n\n' +
      'The contracts are implemented and ready, but need to be deployed to Stellar Testnet.\n\n' +
      'To deploy:\n' +
      '1. Build contracts: cd contracts && cargo build --target wasm32-unknown-unknown --release\n' +
      '2. Deploy: soroban contract deploy --wasm target/.../certificate_contract.wasm --network testnet\n' +
      '3. Set contract IDs in .env file\n\n' +
      'For now, the app will work with mock data for demonstration purposes.';
    
    throw new Error(message);
  }
}

/**
 * Build, simulate, sign, and submit a Soroban contract transaction.
 */
async function invokeContract(contractId, method, params = []) {
  checkContractConfiguration();

  const StellarSDK = await getStellarSDK();
  const { signTransaction } = await import('@stellar/freighter-api');

  const networkPassphrase =
    NETWORK === 'testnet'
      ? StellarSDK.Networks.TESTNET
      : StellarSDK.Networks.PUBLIC;

  const server = new StellarSDK.SorobanRpc.Server(RPC_URL);

  try {
    // 1. Load source account
    const publicKey = await getWalletPublicKey();
    const sourceAccount = await server.getAccount(publicKey);

    // 2. Build transaction
    const contract = new StellarSDK.Contract(contractId);
    const transaction = new StellarSDK.TransactionBuilder(sourceAccount, {
      fee: StellarSDK.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(contract.call(method, ...params))
      .setTimeout(30)
      .build();

    // 3. Simulate
    const simulateResponse = await server.simulateTransaction(transaction);
    if (StellarSDK.SorobanRpc.Api.isSimulationError(simulateResponse)) {
      throw new Error(`Contract simulation failed: ${simulateResponse.error}`);
    }

    // 4. Assemble with simulation results
    const preparedTransaction = StellarSDK.SorobanRpc.assembleTransaction(
      transaction,
      simulateResponse
    ).build();

    // 5. Sign with Freighter
    const signedXdr = await signTransaction(preparedTransaction.toXDR(), {
      network: NETWORK,
      networkPassphrase,
    });

    if (!signedXdr || signedXdr.error) {
      throw new Error('Transaction signing was cancelled or failed.');
    }

    // 6. Submit
    const signedTransaction = StellarSDK.TransactionBuilder.fromXDR(
      signedXdr,
      networkPassphrase
    );
    const sendResponse = await server.sendTransaction(signedTransaction);

    if (sendResponse.status === 'ERROR') {
      throw new Error(`Transaction submission failed: ${sendResponse.errorResult}`);
    }

    // 7. Poll for result
    let getResponse = await server.getTransaction(sendResponse.hash);
    let attempts = 0;
    while (getResponse.status === 'NOT_FOUND' && attempts < 20) {
      await new Promise((r) => setTimeout(r, 1000));
      getResponse = await server.getTransaction(sendResponse.hash);
      attempts++;
    }

    if (getResponse.status === 'SUCCESS') {
      return { 
        success: true, 
        txHash: sendResponse.hash, 
        result: getResponse.returnValue 
      };
    }

    throw new Error(`Transaction did not confirm. Status: ${getResponse.status}`);
  } catch (error) {
    // Re-throw with more context
    if (error.message.includes('Account not found')) {
      throw new Error('Your wallet account needs XLM. Get testnet XLM from https://friendbot.stellar.org');
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Issue a certificate on-chain.
 * Calls CertificateContract::issue_certificate()
 */
export const issueCertificate = async ({ recipient, taskId, metadata = {} }) => {
  try {
    const StellarSDK = await getStellarSDK();

    const params = [
      StellarSDK.Address.fromString(recipient).toScVal(),
      StellarSDK.nativeToScVal(taskId, { type: 'string' }),
      StellarSDK.nativeToScVal(metadata, { type: 'map' }),
    ];

    const result = await invokeContract(CERTIFICATE_CONTRACT_ID, 'issue_certificate', params);

    return {
      success: true,
      txHash: result.txHash,
      certId: StellarSDK.scValToNative(result.result),
    };
  } catch (error) {
    console.error('[issueCertificate] Error:', error);
    throw error;
  }
};

/**
 * Verify a certificate by ID.
 * Calls CertificateContract::verify_certificate()
 */
export const verifyCertificate = async (certId) => {
  try {
    const StellarSDK = await getStellarSDK();

    const params = [StellarSDK.nativeToScVal(certId, { type: 'string' })];
    const result = await invokeContract(CERTIFICATE_CONTRACT_ID, 'verify_certificate', params);
    const certificate = StellarSDK.scValToNative(result.result);

    return { valid: certificate !== null, certificate, txHash: result.txHash };
  } catch (error) {
    console.error('[verifyCertificate] Error:', error);
    return { valid: false, certificate: null, error: error.message };
  }
};

/**
 * Approve a submission and issue a certificate on-chain.
 */
export const approveSubmission = async ({ submissionId, userId, rewardXlm }) => {
  try {
    const publicKey = await getWalletPublicKey();

    const result = await issueCertificate({
      recipient: publicKey,
      taskId: submissionId,
      metadata: {
        submission_id: submissionId,
        reward_xlm: String(rewardXlm),
        approved_at: String(Date.now()),
      },
    });

    return { success: true, txHash: result.txHash, certId: result.certId };
  } catch (error) {
    console.error('[approveSubmission] Error:', error);
    throw error;
  }
};

/**
 * Submit proof for a task (off-chain submission ID, pending admin approval).
 */
export const submitProof = async ({ taskId, proofText, userId }) => {
  try {
    // Wallet check — ensures user is connected before submitting
    await getWalletPublicKey();

    return {
      success: true,
      submissionId: `sub_${taskId}_${Date.now()}`,
      message: 'Proof submitted successfully. Waiting for admin approval.',
    };
  } catch (error) {
    console.error('[submitProof] Error:', error);
    throw error;
  }
};

/**
 * Reject a submission (off-chain operation).
 */
export const rejectSubmission = async ({ submissionId, feedback }) => {
  try {
    return { success: true, message: 'Submission rejected.' };
  } catch (error) {
    console.error('[rejectSubmission] Error:', error);
    throw error;
  }
};

/**
 * Returns true if both contract IDs are configured in the environment.
 */
export const isContractConfigured = () => {
  return !!(CERTIFICATE_CONTRACT_ID && REWARD_CONTRACT_ID);
};

/**
 * Returns the current contract configuration for debugging.
 */
export const getContractConfig = () => ({
  network: NETWORK,
  rpcUrl: RPC_URL,
  certificateContractId: CERTIFICATE_CONTRACT_ID || 'Not configured',
  rewardContractId: REWARD_CONTRACT_ID || 'Not configured',
  isConfigured: isContractConfigured(),
});
