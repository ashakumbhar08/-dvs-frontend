import useTaskStore from "../store/taskStore"

export const useSubmissions = () => {
  const { submissions, addSubmission, updateSubmissionStatus } = useTaskStore()
  return { submissions, addSubmission, updateSubmissionStatus }
}
