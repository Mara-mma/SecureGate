import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: "If your account exists and is not yet verified, a verification email has been sent." },
        { status: 200 }
      )
    }

    const token = crypto.randomBytes(32).toString("hex")

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    try {
      await sendVerificationEmail(user.name, email, token)
    } catch {
      console.error("Failed to send verification email")
    }

    return NextResponse.json(
      { message: "Verification email sent. Please check your inbox." },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "We could not resend the verification email. Please try again." },
      { status: 500 }
    )
  }
}
