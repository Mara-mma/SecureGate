import Link from "next/link"

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-300 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">SecureGate</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[430px] text-center">
          <h2 className="text-5xl font-bold text-gray-900 leading-[58px] mb-2">
            Authentication that&apos;s built right
          </h2>
          <p className="text-base text-gray-500 leading-snug mb-8 max-w-[280px] mx-auto">
            Email verification, password reset, rate limiting, and secure auth.
          </p>
          <Link
            href="/auth?mode=signup&focusName=true"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md text-sm transition-colors"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  )
}
