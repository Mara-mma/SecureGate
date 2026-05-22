# Skill: Database Schema

## Purpose
Create the Prisma schema for SecureGate with exactly 3 models.

## The Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String    // Always bcrypt hashed — NEVER plain text
  emailVerified DateTime? // null = not verified, date = when they verified
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  id         String   @id @default(cuid())
  identifier String   // The user's email address
  token      String   @unique
  expires    DateTime // Set to 15 minutes from creation
  createdAt  DateTime @default(now())
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime // Set to 1 hour from creation
  createdAt DateTime @default(now())
}
```

## How to Apply
Run this command after creating or editing the schema:
```bash
npx prisma migrate dev --name <description>
```

Example:
```bash
npx prisma migrate dev --name init
```

## Rules
- Never add models not listed here (YAGNI)
- emailVerified being null means the user has NOT verified their email
- Always delete tokens after they are used — never leave stale tokens
- Never store plain text passwords in the password field
