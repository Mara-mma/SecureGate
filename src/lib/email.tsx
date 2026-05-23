import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import VerificationEmail from "../../emails/VerificationEmail"
import PasswordResetEmail from "../../emails/PasswordResetEmail"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(name: string, email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`

  const html = await render(<VerificationEmail name={name} verificationUrl={verificationUrl} />)

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your email address",
    html,
  })
}

export async function sendPasswordResetEmail(name: string, email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`

  const html = await render(<PasswordResetEmail name={name} resetUrl={resetUrl} />)

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    html,
  })
}
