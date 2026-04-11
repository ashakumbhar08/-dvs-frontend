// PLACEHOLDER — replace with Soroban contract calls

export const submitProof = async ({ taskId, proofText, userId }) => {
  await new Promise((r) => setTimeout(r, 1000))
  console.log("CONTRACT CALL: submitProof", { taskId, proofText, userId })
  return { success: true, txHash: "MOCK_TX_" + Date.now() }
}

export const approveSubmission = async ({ submissionId, userId, rewardXlm }) => {
  await new Promise((r) => setTimeout(r, 1000))
  console.log("CONTRACT CALL: approveSubmission", { submissionId, userId, rewardXlm })
  return {
    success: true,
    txHash: "MOCK_TX_" + Date.now(),
    certId: "cert_" + Date.now(),
  }
}

export const rejectSubmission = async ({ submissionId, feedback }) => {
  await new Promise((r) => setTimeout(r, 600))
  console.log("CONTRACT CALL: rejectSubmission", { submissionId, feedback })
  return { success: true }
}

export const verifyCertificate = async (certIdOrHash) => {
  await new Promise((r) => setTimeout(r, 800))
  console.log("CONTRACT CALL: verifyCertificate", certIdOrHash)
  return { valid: true, certificate: null }
}
