import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import LogoutButton from "./LogoutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth?mode=login")
  }

  if (!session.user.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">SecureGate</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
            Please verify your email before accessing the dashboard.
          </div>
          <LogoutButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">SecureGate</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Secure Auth Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {session.user.name}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
            Verified
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-300">
            Account
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">User ID</p>
              <p className="text-gray-900 font-medium font-mono text-xs break-all">{session.user.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-300">
            Security
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Session Status</p>
              <p className="text-gray-900 font-medium">Active</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Authentication</p>
              <p className="text-gray-900 font-medium">Email & Password</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
