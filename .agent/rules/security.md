# SecureGate — Security Rules

## The Golden Rules (Never Break These)

### 1. Passwords
- ALWAYS hash passwords with bcryptjs before saving to the database
- ALWAYS use 12 salt rounds: bcrypt.hash(password, 12)
- NEVER store or log a plain text password anywhere
- NEVER use SHA-256 or MD5 for passwords — bcrypt only
- When comparing passwords: bcrypt.compare(input, hash) — never decrypt

### 2. Tokens
- ALL tokens must be generated with: crypto.randomBytes(32).toString('hex')
- Verification tokens expire in 15 minutes
- Password reset tokens expire in 1 hour
- ALWAYS delete a token from the database after it has been used
- ALWAYS check token expiry before allowing any action

### 3. Environment Variables
- ALL secrets go in .env.local — never in code files
- Required variables:
  - DATABASE_URL
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USER
  - SMTP_PASS
  - SMTP_FROM
- .env.local must be in .gitignore before the first git push
- Never console.log() any environment variable

### 4. Error Messages
- NEVER reveal whether an email exists or not
  - Wrong: "No account found with that email"
  - Right: "If an account exists, you will receive an email"
- NEVER reveal what the password was or hints about it
  - Wrong: "Password must be longer"
  - Right: "Invalid credentials"
- NEVER expose stack traces or database errors to the user
- Always catch errors and return generic messages on the client

### 5. Rate Limiting
- Login endpoint: max 5 attempts per IP per 10 minutes
- Forgot password endpoint: max 3 attempts per IP per 10 minutes
- If limit exceeded: return 429 status with message "Too many attempts. Please try again later."
- Rate limiting must happen BEFORE password checking
- Rate limiter is in-memory (Map-based) — resets on server restart

### 6. Input Validation
- ALWAYS validate with Zod on the server side
- NEVER trust data coming from the client
- Validate: email format, password length (min 8 chars), required fields
- Sanitise inputs before any database query

### 7. HTTP Security Headers (in next.config.js)
Add these headers to every response:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 8. Session Security
- Use JWT session strategy in NextAuth
- NEXTAUTH_SECRET must be a long random string (min 32 characters)
- If a user deletes their session cookie: redirect to /login immediately
- Only verified users (emailVerified is not null) can access /dashboard
