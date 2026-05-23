"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  if (password.length < 8 || !hasUpper || !hasLower || !hasNumber) {
    return { label: "Weak", color: "bg-red-500", width: "w-1/3" }
  }

  if (hasSymbol) return { label: "Strong", color: "bg-green-500", width: "w-full" }
  return { label: "Fair", color: "bg-yellow-500", width: "w-2/3" }
}

interface SignupFormProps {
  onSwitchMode: (mode: string) => void
  focusName?: boolean
}

export default function SignupForm({ onSwitchMode, focusName }: SignupFormProps) {
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [errorCode, setErrorCode] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (focusName && nameRef.current) {
      nameRef.current.focus()
    }
  }, [focusName])

  const strength = password ? getPasswordStrength(password) : null

  const hasUpper = /[A-Z]/
  const hasLower = /[a-z]/
  const hasNumber = /[0-9]/

  const requirements = [
    { key: "length", label: "At least 8 characters", check: (pw: string) => pw.length >= 8 },
    { key: "uppercase", label: "One uppercase letter", check: (pw: string) => hasUpper.test(pw) },
    { key: "lowercase", label: "One lowercase letter", check: (pw: string) => hasLower.test(pw) },
    { key: "number", label: "One number", check: (pw: string) => hasNumber.test(pw) },
  ]

  function passwordMeetsRequirements(pw: string): boolean {
    return pw.length >= 8 && hasUpper.test(pw) && hasLower.test(pw) && hasNumber.test(pw)
  }

  function validateField(field: string, value: string) {
    if (!value.trim()) {
      setFieldErrors((prev) => ({ ...prev, [field]: "this field cannot be empty" }))
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = "this field cannot be empty"
    if (!email.trim()) errors.email = "this field cannot be empty"
    else if (!emailRegex.test(email)) errors.email = "enter a valid email address"
    if (!password.trim()) errors.password = "this field cannot be empty"
    else if (!passwordMeetsRequirements(password)) errors.password = "this field cannot be empty"
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setErrorCode(null)
    setFieldErrors({})
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setErrorCode(res.status)
        setLoading(false)
        return
      }

      router.push("/auth?mode=login")
    } catch {
      setError("We could not create your account. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
          <p>{error}</p>
          {errorCode === 409 && (
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer mt-1 inline-block"
            >
              Sign in
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Full Name
          </label>
          <input
            ref={nameRef}
            id="name"
            type="text"
            value={name}
            onBlur={() => validateField("name", name)}
            onChange={(e) => { setName(e.target.value); clearFieldError("name") }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-gray-800 ${fieldErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          />
          {fieldErrors.name && <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onBlur={() => { if (!email.trim()) setFieldErrors((prev) => ({ ...prev, email: "this field cannot be empty" })) }}
            onChange={(e) => {
              const val = e.target.value
              setEmail(val)
              if (val && !emailRegex.test(val)) {
                setFieldErrors((prev) => ({ ...prev, email: "enter a valid email address" }))
              } else {
                clearFieldError("email")
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm text-gray-800 ${fieldErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          />
          {fieldErrors.email && <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onBlur={() => validateField("password", password)}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password") }}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 text-sm text-gray-800 ${fieldErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password && <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>}

          {password.length > 0 && !passwordMeetsRequirements(password) && (
            <ul className="mt-2 space-y-1">
              {requirements.map((req) => !req.check(password) && (
                <li key={req.key} className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span>○</span> {req.label}
                </li>
              ))}
            </ul>
          )}

          {strength && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
              </div>
              <p className={`text-xs mt-1 ${strength.label === "Weak" ? "text-red-600" : strength.label === "Fair" ? "text-yellow-600" : "text-green-600"}`}>
                {strength.label}
              </p>
            </div>
          )}
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
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Already have an account?{" "}
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
