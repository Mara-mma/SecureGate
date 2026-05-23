"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import LoginForm from "@/components/LoginForm"
import SignupForm from "@/components/SignupForm"
import ForgotPasswordForm from "@/components/ForgotPasswordForm"

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") || "login"

  function switchMode(newMode: string) {
    router.push(`/auth?mode=${newMode}`)
  }

  function isActive(tab: string) {
    return mode === tab
      ? "text-blue-600 border-blue-600"
      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">SecureGate</h1>

        <div className="flex border-b border-gray-300 mb-6">
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors bg-transparent cursor-pointer ${isActive("signup")}`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors bg-transparent cursor-pointer ${isActive("login")}`}
          >
            Sign in
          </button>
        </div>

        {mode === "login" && <LoginForm onSwitchMode={switchMode} />}
        {mode === "signup" && <SignupForm onSwitchMode={switchMode} focusName={searchParams.get("focusName") === "true"} />}
        {mode === "forgot-password" && <ForgotPasswordForm onSwitchMode={switchMode} />}
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}
