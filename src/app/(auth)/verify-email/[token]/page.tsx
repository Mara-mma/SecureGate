import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ResendForm from "./ResendForm"

interface Props {
  params: { token: string }
}

export default async function VerifyEmailPage({ params }: Props) {
  const { token } = params

  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">SecureGate</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
            Invalid or expired verification link.
          </div>
          <Link href="/auth?mode=login" className="text-sm text-blue-600 hover:underline font-medium">
            Go to login
          </Link>
          <ResendForm />
        </div>
      </div>
    )
  }

  if (existingToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    })

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">SecureGate</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm mb-4">
            This verification link has expired.
          </div>
          <Link href="/auth?mode=login" className="text-sm text-blue-600 hover:underline font-medium">
            Go to login
          </Link>
          <ResendForm />
        </div>
      </div>
    )
  }

  await prisma.user.update({
    where: { email: existingToken.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({
    where: { token },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">SecureGate</h1>
        <div className="bg-green-50 border border-green-200 text-green-700 rounded p-3 text-sm mb-4">
          Email verified successfully. You can now log in.
        </div>
          <Link href="/auth?mode=login" className="text-sm text-blue-600 hover:underline font-medium">
            Go to login
          </Link>
        </div>
      </div>
    )
}
