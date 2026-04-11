export const TASK_CATEGORIES = ["DeFi", "Development", "Documentation", "Design", "Research", "Community"]

export const TASK_STATUS = { DRAFT: "draft", ACTIVE: "active", PAUSED: "paused", CLOSED: "closed" }

export const SUBMISSION_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
}

export const ROLES = { USER: "user", ADMIN: "admin" }

export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY: "/verify",
  DASHBOARD: "/dashboard",
  TASKS: "/tasks",
  TASK_DETAIL: (id) => `/tasks/${id}`,
  MY_SUBMISSIONS: "/my-submissions",
  MY_CERTIFICATES: "/my-certificates",
  ADMIN: "/admin",
  ADMIN_TASKS: "/admin/tasks",
  ADMIN_QUEUE: "/admin/queue",
}
