import { useParams } from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout"
import LoginForm from "../components/forms/LoginForm"

export default function Login({ mode }) {
  const resolvedMode = mode || "login"

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              DVS
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {resolvedMode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {resolvedMode === "signup"
                ? "Join the decentralized verification network"
                : "Sign in to your DVS account"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <LoginForm mode={resolvedMode} />
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
