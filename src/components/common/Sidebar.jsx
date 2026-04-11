import { NavLink, Link } from "react-router-dom"
import { ROUTES } from "../../utils/constants"
import useTaskStore from "../../store/taskStore"

// Minimal SVG icon set
const Icons = {
  home: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  tasks: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  submissions: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  certificates: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  dashboard: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  queue: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const userLinks = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: Icons.dashboard },
  { to: ROUTES.TASKS, label: "Browse Tasks", icon: Icons.tasks },
  { to: ROUTES.MY_SUBMISSIONS, label: "My Submissions", icon: Icons.submissions },
  { to: ROUTES.MY_CERTIFICATES, label: "My Certificates", icon: Icons.certificates },
]

const adminLinks = [
  { to: ROUTES.ADMIN, label: "Dashboard", icon: Icons.dashboard, end: true },
  { to: ROUTES.ADMIN_TASKS, label: "Tasks", icon: Icons.tasks },
  { to: ROUTES.ADMIN_QUEUE, label: "Approval Queue", icon: Icons.queue, badge: true },
]

const disabledUserLinks = ["Activity Log", "Settings"]
const disabledAdminLinks = ["Users", "Analytics", "Reward Pool", "Settings"]

export default function Sidebar({ role = "user" }) {
  const submissions = useTaskStore((s) => s.submissions)
  const pendingCount = submissions.filter((s) => s.status === "pending").length
  const links = role === "admin" ? adminLinks : userLinks
  const disabledLinks = role === "admin" ? disabledAdminLinks : disabledUserLinks

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-full py-5 px-3 flex flex-col gap-0.5">
      {/* Home link at top */}
      <Link
        to={ROUTES.LANDING}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors mb-1"
      >
        {Icons.home}
        <span>Home</span>
      </Link>

      <div className="border-t border-gray-100 my-1" />

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-brand-50 text-brand-800 font-medium border-l-2 border-brand-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          {link.icon}
          <span className="flex-1">{link.label}</span>
          {link.badge && pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
              {pendingCount}
            </span>
          )}
        </NavLink>
      ))}

      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-0.5">
        {disabledLinks.map((label) => (
          <span
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 cursor-not-allowed select-none"
          >
            <span className="w-4 h-4 shrink-0" />
            {label}
          </span>
        ))}
      </div>
    </aside>
  )
}
