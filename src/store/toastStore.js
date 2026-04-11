import { create } from "zustand"

const useToastStore = create((set) => ({
  toasts: [],

  show: ({ type = "info", message }) => {
    const id = Date.now().toString()
    set((s) => ({
      toasts: [...s.toasts.slice(-2), { id, type, message }],
    }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export default useToastStore
