import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import VerifyCertificate from "./pages/VerifyCertificate"
import Dashboard from "./pages/user/Dashboard"
import TaskBrowser from "./pages/user/TaskBrowser"
import TaskDetail from "./pages/user/TaskDetail"
import MySubmissions from "./pages/user/MySubmissions"
import MyCertificates from "./pages/user/MyCertificates"
import AdminDashboard from "./pages/admin/AdminDashboard"
import TaskManagement from "./pages/admin/TaskManagement"
import ApprovalQueue from "./pages/admin/ApprovalQueue"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/signup" element={<Login mode="signup" />} />
        <Route path="/verify" element={<VerifyCertificate />} />

        {/* User (protected inside UserLayout) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskBrowser />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/my-submissions" element={<MySubmissions />} />
        <Route path="/my-certificates" element={<MyCertificates />} />

        {/* Admin (protected inside AdminLayout) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tasks" element={<TaskManagement />} />
        <Route path="/admin/tasks/new" element={<TaskManagement />} />
        <Route path="/admin/tasks/:id/edit" element={<TaskManagement />} />
        <Route path="/admin/queue" element={<ApprovalQueue />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
