import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import { checkRateLimit } from "@/lib/ratelimit"

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown"

    if (!checkRateLimit(ip, 3, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests, try again later" },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token = crypto.randomBytes(32).toString("hex")

      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      try {
        await sendPasswordResetEmail(user.name, email, token)
      } catch {
        console.error("Failed to send password reset email")
      }
    }

    return NextResponse.json(
      { message: "If an account with that email exists, a reset link has been sent." },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "We could not process your request. Please try again." },
      { status: 500 }
    )
  }
}
