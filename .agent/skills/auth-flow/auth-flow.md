# Skill: Auth Flow

## Purpose
Implement Sign Up, Login, and Logout using NextAuth Credentials provider.

## Sign Up Flow (POST /api/signup)
1. Receive: name, email, password
2. Validate with Zod (email format, password min 8 chars, name required)
3. Check if email already exists in database
4. If exists: return 400 with generic message (do NOT confirm email exists)
5. Hash password: bcrypt.hash(password, 12)
6. Save new User to database (emailVerified = null)
7. Generate verification token: crypto.randomBytes(32).toString('hex')
8. Save token to VerificationToken table (expires: 15 min from now)
9. Send verification email via Resend (see email-sender skill)
10. Return 200: "Please check your email to verify your account"

## Login Flow (NextAuth authorize function)
1. Rate limit check — block if over 5 attempts per IP per 10 min
2. Receive: email, password
3. Look up user by email
4. If not found: return null (NextAuth will show generic error)
5. Compare password: bcrypt.compare(inputPassword, user.password)
6. If wrong: return null
7. Check emailVerified is not null
8. If not verified: throw error "Please verify your email before logging in"
9. If all checks pass: return the user object

## Logout
- Use NextAuth signOut() on the client
- After logout: redirect to /login
- Session cookie is destroyed automatically by NextAuth

## Session Strategy
Use JWT (not database sessions) — simpler to set up, works well for this scope.

## Error Message Rules
- Wrong email or password: "Invalid email or password"
- Not verified: "Please verify your email before logging in"
- Rate limited: "Too many attempts. Please try again in 10 minutes."
- Never say which field was wrong
