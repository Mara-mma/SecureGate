import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">SecureGate is running</h1>
      <div className="flex gap-4">
        <Link href="/login">Log in</Link>
        <Link href="/signup">Sign up</Link>
      </div>
    </div>
  )
}
