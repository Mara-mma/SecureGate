"use client"

import { useState } from "react"

export default function ResendForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setMessage(data.message || data.error)
      setLoading(false)
    } catch {
      setError("We could not resend the verification email. Please try again.")
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="text-sm text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer mt-3 block"
      >
        Resend verification email
      </button>
    )
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-500 mb-3">Enter your email to receive a new verification link.</p>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded p-3 text-sm mb-3">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          id="resend-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send verification email"}
        </button>
      </form>
    </div>
  )
}
