import { create } from "zustand"
import {
  tasks as mockTasks,
  submissions as mockSubmissions,
  certificates as mockCertificates,
} from "../data/mockData"

const useTaskStore = create((set) => ({
  tasks:       mockTasks,
  submissions: mockSubmissions,
  certificates: mockCertificates,
  currentTask: null,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((s) => ({ tasks: [task, ...s.tasks] })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  updateTaskStatus: (id, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  setCurrentTask: (task) => set({ currentTask: task }),

  addSubmission: (submission) =>
    set((s) => ({ submissions: [submission, ...s.submissions] })),

  updateSubmissionStatus: (id, status, feedback = null) =>
    set((s) => ({
      submissions: s.submissions.map((sub) =>
        sub.id === id
          ? { ...sub, status, adminFeedback: feedback, reviewedAt: new Date().toISOString() }
          : sub
      ),
    })),

  addCertificate: (cert) =>
    set((s) => ({ certificates: [cert, ...s.certificates] })),
}))

export default useTaskStore
