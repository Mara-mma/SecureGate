# Skill: Email Sender

## Purpose
Send transactional emails using Nodemailer and React Email templates.

## Setup (lib/email.tsx)
```typescript
import nodemailer from "nodemailer"
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

const baseUrl = process.env.NEXTAUTH_URL!

export async function sendVerificationEmail(name: string, email: string, token: string) {
  const verifyUrl = `${baseUrl}/verify-email/${token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your SecureGate account",
    html: VerificationEmail({ name, verifyUrl }),
  })
}

export async function sendPasswordResetEmail(name: string, email: string, token: string) {
  const resetUrl = `${baseUrl}/reset-password/${token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your SecureGate password",
    html: PasswordResetEmail({ name, resetUrl }),
  })
}
```

## Email Templates
Create simple, clean React Email templates in the /emails folder.
Each template receives a URL and displays:
- The app name (SecureGate)
- A short explanation of what the link does
- A clear call-to-action button with the URL
- A note that the link expires (15 min for verification, 1 hour for reset)

## Rules
- Never send an email that confirms whether an account exists
- Always wrap email sending in try/catch — a failed email should not crash the signup
- Test with a real email address during development
- Use Nodemailer with SMTP — do not use Resend
