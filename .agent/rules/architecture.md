# SecureGate — Architecture Rules

## What This Project Is
SecureGate is a standalone authentication app built with Next.js 14 (App Router).
It is NOT a full product. It has one job: authentication and security.
Do not add features that are not listed in this file.

## Tech Stack
- Framework: Next.js 14 with App Router and TypeScript
- Database: PostgreSQL via Prisma ORM
- Auth: NextAuth.js (Credentials provider only)
- Password Hashing: bcryptjs (salt rounds: 12)
- Email: Resend + React Email
- Validation: Zod (server-side only)
- Rate Limiting: Upstash Redis
- Styling: Tailwind CSS
- Deployment: Vercel

## Folder Structure
Follow this structure exactly. Do not invent new folders.

```
securegate/
├── .agent/                        ← Agent instructions (do not modify)
├── prisma/
│   └── schema.prisma              ← All database models live here
├── src/
│   ├── app/                       ← All pages and API routes
│   │   ├── (auth)/                ← Route group for auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── [token]/
│   │   │   │       └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── [token]/
│   │   │           └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx           ← Protected — verified users only
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── signup/
│   │       │   └── route.ts
│   │       ├── verify-email/
│   │       │   └── route.ts
│   │       ├── forgot-password/
│   │       │   └── route.ts
│   │       └── reset-password/
│   │           └── route.ts
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   ├── PasswordStrength.tsx
│   │   └── LoadingButton.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   ├── tokens.ts
│   │   └── ratelimit.ts
│   ├── schemas/
│   │   └── auth.ts
│   └── middleware.ts
├── emails/
│   ├── VerificationEmail.tsx
│   └── PasswordResetEmail.tsx
├── .env.local                     ← NEVER commit this file
├── .gitignore
├── next.config.js
└── REFLECTION.md
```

## Pages & Access Control
| Route | Who Can Access |
|---|---|
| /signup | Anyone (not logged in) |
| /login | Anyone (not logged in) |
| /forgot-password | Anyone |
| /reset-password/[token] | Anyone with a valid token |
| /verify-email/[token] | Anyone with a valid token |
| /dashboard | Verified + authenticated users ONLY |

## Database Models (3 total)
1. User — stores account info and hashed password
2. VerificationToken — stores email verification tokens (expires: 15 min)
3. PasswordResetToken — stores password reset tokens (expires: 1 hour)

## Hard Rules
- Never create pages or routes not listed above
- Never store plain text passwords — always use bcrypt with 12 salt rounds
- Never hardcode API keys or secrets — always use environment variables
- Always validate inputs with Zod before touching the database
- /dashboard must check both: authenticated AND emailVerified = true
