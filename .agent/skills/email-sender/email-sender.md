# Skill: Email Sender

## Purpose
Send transactional emails using Resend and React Email templates.

## Setup (lib/email.ts)
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`
  
  await resend.emails.send({
    from: 'SecureGate <noreply@yourdomain.com>',
    to: email,
    subject: 'Verify your SecureGate account',
    react: VerificationEmail({ verifyUrl }),
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`
  
  await resend.emails.send({
    from: 'SecureGate <noreply@yourdomain.com>',
    to: email,
    subject: 'Reset your SecureGate password',
    react: PasswordResetEmail({ resetUrl }),
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
