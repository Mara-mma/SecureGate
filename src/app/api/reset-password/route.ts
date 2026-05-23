import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

async function validateToken(token: string) {
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    return { valid: false, error: "Invalid or expired reset link" }
  }

  if (existingToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
    return { valid: false, error: "This reset link has expired" }
  }

  return { valid: true, error: null, email: existingToken.email }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    const result = await validateToken(token)

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ valid: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "We could not validate your reset link. Please try again." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const validation = await validateToken(token)

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.passwordResetToken.delete({ where: { token } }),
      prisma.user.update({
        where: { email: validation.email! },
        data: { password: hashedPassword },
      }),
    ])

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "We could not reset your password. Please try again." },
      { status: 500 }
    )
  }
}
