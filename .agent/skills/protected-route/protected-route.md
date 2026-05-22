# Skill: Protected Route

## Purpose
Protect the /dashboard route so only verified, authenticated users can access it.

## Middleware (src/middleware.ts)
```typescript
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

This tells NextAuth to protect every URL that starts with /dashboard.
If a user is not logged in, they are automatically redirected to /login.

## Dashboard Page Check (Additional Layer)
Inside the dashboard page itself, add a second check:
1. Get the session using getServerSession()
2. If no session: redirect to /login
3. If session exists but emailVerified is null: redirect to /login with message
4. If both checks pass: show the dashboard

## What Happens When a User Deletes Their Cookie
1. The middleware runs on the next request to /dashboard
2. NextAuth finds no valid session cookie
3. User is immediately redirected to /login
4. They must log in again to get a new session

## Rule
Never rely on only one check. Always verify:
- Is the user authenticated? (session exists)
- Is the user verified? (emailVerified is not null)
Both must be true to access the dashboard.
