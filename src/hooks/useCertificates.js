import useTaskStore from "../store/taskStore"

export const useCertificates = () => {
  const { certificates, addCertificate } = useTaskStore()
  return { certificates, addCertificate }
}
