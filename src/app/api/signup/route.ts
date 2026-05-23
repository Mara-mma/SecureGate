import crypto from "node:crypto"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { signupSchema } from "@/schemas/auth"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const token = crypto.randomBytes(32).toString("hex")

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    try {
      await sendVerificationEmail(name, email, token)
    } catch {
      console.error("Failed to send verification email")
    }

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already registered. Please sign in instead." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: "We could not create your account. Please try again." },
      { status: 500 }
    )
  }
}
