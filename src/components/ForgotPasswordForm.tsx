"use client"

import { useState } from "react"

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: string) => void
}

export default function ForgotPasswordForm({ onSwitchMode }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")
    setFieldError("")

    if (!email.trim()) {
      setFieldError("this field cannot be empty")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      setMessage(data.message)
      setSent(true)
      setLoading(false)
    } catch {
      setError("We could not send the reset link. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <p className="text-sm text-gray-500 text-center mb-6">Reset your password</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded p-3 text-sm mb-4">
          {message}
        </div>
      )}

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onBlur={() => { if (!email.trim()) setFieldError("this field cannot be empty") }}
              onChange={(e) => { setEmail(e.target.value); setFieldError("") }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-gray-800 ${fieldError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            />
            {fieldError && <p className="text-red-600 text-xs mt-1">{fieldError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => onSwitchMode("login")}
          className="block w-full text-center text-sm text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
        >
          Back to login
        </button>
      )}

      <p className="text-sm text-gray-500 text-center mt-6">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => onSwitchMode("login")}
          className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </>
  )
}
