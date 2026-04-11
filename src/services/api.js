// All API calls — currently using dummy data
// Replace with real HTTP calls when backend is ready

import {
  tasks,
  submissions,
  certificates,
  users,
  activityFeed,
  stats,
} from "../utils/dummyData"

export const getTasks = async () => tasks
export const getTaskById = async (id) => tasks.find((t) => t.id === id) || null
export const getSubmissions = async () => submissions
export const getSubmissionsByUser = async (userId) =>
  submissions.filter((s) => s.userId === userId)
export const getCertificates = async () => certificates
export const getCertificatesByUser = async (userId) =>
  certificates.filter((c) => c.userId === userId)
export const getUsers = async () => users
export const getActivityFeed = async () => activityFeed
export const getStats = async () => stats
