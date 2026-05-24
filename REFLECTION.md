# SecureGate — Reflection & Engineering Analysis

**Name:** [Chidimma Maryann Madu]
**Cohort:** Design to MVP Bootcamp
**Live URL:** [https://secure-gate-blond.vercel.app/]
**GitHub Repo:** https://github.com/Mara-mma/SecureGate

---

## Part 1 — What I Built

I built SecureGate, a full authentication system using Next.js, Prisma, and NextAuth. It includes user signup, login/logout, email verification, password reset, and rate limiting. I implemented secure flows such as token-based email verification, password reset with expiry, and protected routes that restrict access to authenticated users only.

## Part 2 — What Surprised Me

What surprised me the most was how many things can go wrong even when the logic seems correct. For example, during the password reset flow, I noticed that a reset link could still be reused after changing the password, which is a serious security issue. I also ran into issues with email delivery when using Resend because I did not have a verified domain, which forced me to switch to Nodemailer. These experiences showed me that real-world systems require constant testing and validation beyond just writing code.


## Part 3 — Engineering Laws Quiz

### Q1 — Murphy's Law

**Code reference:** `src/app/api/reset-password/route.ts`

**My Answer:**
Login and signup worked fine when I tested them. The problem showed up during the password reset flow. I discovered two things I did not expect: first, if I manually modified the reset URL, I could still get through. Second, after successfully resetting my password, I could go back and use the same reset link again — the token was not being deleted after use. Murphy's Law was right. I had to go back and fix this by ensuring the token is deleted after successful use and properly validated.

Murphy's Law also forced me to add two other protections I would not have thought about upfront. The first is rate limiting on the login endpoint at `src/lib/ratelimit.ts` + `src/lib/auth.ts:27` — without it, an attacker could try thousands of passwords per minute against any account. The second is token expiry: verification tokens expire after 15 minutes (`src/app/api/signup/route.ts:40`) and reset tokens after 1 hour. If tokens never expired, a leaked token from months ago could still grant access.

**What goes wrong if ignored:**
An attacker could reuse a reset link multiple times to repeatedly change a user's password, or manipulate the URL to bypass validation entirely. Without rate limiting, brute-force password guessing is unlimited. Without token expiry, old tokens never become invalid.

---

### Q2 — Law of Leaky Abstractions

**Code reference:** `src/lib/email.ts`, Nodemailer setup

**My Answer:**
Resend looked simple on the surface, just install, add the API key, and send emails. But when I actually used it, I hit a wall. Resend requires a verified custom domain before it can send emails to real addresses. I created an account, got my API key, set everything up, and it still would not work. I even tried using Resend's own default domain and that also failed. The abstraction made it look easy but underneath it had real-world requirements that only showed up when I tested it. I had to switch to Nodemailer with Gmail SMTP and an app password to actually get emails sending. The assignment said Resend, but the reality of the tool forced me to go a layer deeper and find something that actually worked.

**What goes wrong if ignored:**
If I had just assumed the abstraction would work without testing it end to end, email verification would have silently failed in production and users would never receive their verification links.

---

### Q3 — YAGNI

**Code reference:** `src/app/(auth)/auth/page.tsx`

**My Answer:**
YAGNI says build what you need now, so I built sign up, login, email verification, password reset, rate limiting, and a protected dashboard. Things like social login, multi-factor auth, or audit logs were never on my list because the assignment scope did not need them. Adding them would have been extra complexity on top of a flow that was not even finished yet.

**What goes wrong if ignored:**
Adding features nobody asked for wastes time, introduces new bugs, and makes the core flow harder to debug and maintain.

---

### Q4 — Kerckhoffs's Principle

**Code reference:** `src/app/api/signup/route.ts`

**My Answer:**
The assignment asked us to verify this during the build phases. After a I signed up, I opened my database in Neon and clicked on the user record. I had used "Chi123456!" as my test password, but what I saw in the password column was not "Chi123456!" — it was a long mixed string of random characters, the bcrypt hash. That confirmed the hashing was working correctly.

A salt is a random string that bcrypt automatically adds to your password before hashing it. So even if two users both use the password "Chi123456!", their hashes in the database will look completely different because each one got a different salt. 

If I had stored SHA-256 hashes instead, an attacker who got access to the database could just take a list of the most common passwords, run SHA-256 on all of them, and match them against every user in seconds. Bcrypt is deliberately slow,  it takes around 250ms per attempt which makes that kind of attack take far too long to be practical.

**What goes wrong if ignored:**
If passwords are stored as plain text or weak hashes like SHA-256, a single database breach exposes every user's password immediately.

---

### Q5 — Postel's Law + Security by Design

**Code reference:** `src/app/api/forgot-password/route.ts`

**My Answer:**
I tested this myself. I went to the forgot password page and entered an email address I had never used to sign up. The message that came back was: "If an account with that email exists, a reset link has been sent." The same message appeared whether the email existed in the database or not. So there was no way to tell from the response whether the account was real or not. This was intentional the endpoint should never confirm or deny whether an email is registered.

**What goes wrong if ignored:**
If the endpoint returned something like "email not found" for unknown addresses, an attacker could use it to figure out which emails are registered in the system and then target those users.

---

### Q6 — The Boy Scout Rule

**Code reference:** `.env.local`, `.env`

**My Answer:**
I noticed at some point that I had two environment files — a `.env` file and a `.env.local` file. OpenCode flagged it as an issue, and we had to move all the secrets from `.env` into `.env.local` where they belonged, so nothing sensitive was in the wrong place. That was a cleanup that was not part of the original plan but had to be done. Also during the build, OpenCode removed some Upstash-related variables that were sitting in the environment file but were never actually being used by the code — dead variables that had no purpose. Both of these were small things, but leaving them would have caused confusion later.

**What goes wrong if ignored:**
Having secrets in the wrong file could lead to them being accidentally committed to GitHub. Dead environment variables confuse anyone who reads the code later and tries to figure out what the project actually needs.

---

### Q7 — Gall's Law

**Code reference:** `prisma/schema.prisma`, `src/app/api/`

**My Answer:**
I actually experienced this law firsthand. When I first saw the assignment, I was confused because I wanted to see the UI first, I wanted to build everything at once so I could see what I was building. I even tried that approach and the antigravity AI agent got exhausted before anything was working. I had to stop, rethink, and start all over again. This time I went phase by phase. Phase one was just setting up the database and schema, nothing else. I checked the database to confirm the tables were there before moving on. Phase two was auth. Only when that was working did I move to email verification. By the time I got to the UI, I already knew the backend worked, so I was just building on top of something solid.

**What goes wrong if ignored:**
I know from experience when I tried to build everything at once, nothing worked and I could not tell what was broken. Starting over phase by phase was the only thing that actually got the project done.

---

### Q8 — Law of Leaky Abstractions (ORMs)

**Code reference:** `prisma/schema.prisma`

**My Answer:**
I checked this while writing the reflection. In my Prisma schema, the `id` field is defined as `@id @default(cuid())` which looks like Prisma is handling everything. But when I opened Neon and looked at the actual table, the `id` column shows as `TEXT PRIMARY KEY` with no default value at the database level. Prisma generates the CUID in its own client before sending it to the database, the database itself has no idea how to generate that ID on its own. So what Prisma shows you in the schema and what actually exists in PostgreSQL are not the same thing.

**What goes wrong if ignored:**
If you bypass Prisma and try to insert a record directly into the database using raw SQL, the `id` column would be empty because the database has no default for it. Prisma's abstraction handles it silently, but the moment you go underneath it, things break.

---

### Q9 — Zawinski's Law

**Code reference:** `src/lib/ratelimit.ts`

**My Answer:**
Rate limiting is not something Next.js or NextAuth comes with out of the box. I had to specifically ask for it to be added as a separate piece of the project. That itself is the point authentication libraries do one thing, and if they tried to also handle rate limiting, IP detection, configurable windows, and everything else, they would become bloated and hard to use. So it had to live in its own file, `src/lib/ratelimit.ts`, separate from the auth logic. Each tool does its own job and nothing more.

**What goes wrong if ignored:**
Without rate limiting, the login endpoint is open to brute force attacks. Someone could try thousands of password combinations with nothing stopping them.

---

### Q10 — Principle of Least Surprise

**Code reference:** `src/components/LoginForm.tsx`

**My Answer:**
I tested all three scenarios myself. When I entered the wrong email or password, the message I got was "Invalid credentials" it did not tell me which one was wrong, just that the combination did not work. Then after signing up, I deliberately did not click the verification link and tried to log in anyway. The message I got was "Please verify your email before logging in." Finally, I tried logging in multiple times with the wrong password up to five times and on the sixth attempt I got "Too many attempts. Please try again later." Each message told me exactly what was wrong without revealing anything it should not.

**What goes wrong if ignored:**
If the error said "email not found" versus "wrong password," an attacker would know which emails are registered. If it just said "something went wrong," real users would be confused and not know what to do next.

---

### Q11 — Murphy's Law + Defensive Programming

**Code reference:** `src/middleware.ts`, `src/app/dashboard/page.tsx`

**My Answer:**
I tested this and it confused me at first. When I was logged in and copied the dashboard URL and pasted it in a new tab, I landed on the dashboard immediately. I thought that meant the dashboard was not protected. So I opened a completely different Chrome account, pasted the same URL, and I was redirected to login. That is when I realised the first tab worked because I was already logged in on that browser, not because the route was open. To confirm, I logged out on the original browser and tried the URL again and it redirected me to login.

The way the middleware actually knows you are authenticated is by reading your session cookie using getToken({ req }). This is NextAuth's JWT decoder it looks for the session cookie in the request, reads the token inside it, and checks if it is valid. If the token is there and valid, you get through. If it is not, the middleware immediately redirects you to the login page.

So if a user manually deletes their session cookie, here is exactly what happens: the browser sends the request to /dashboard with no cookie. The middleware calls getToken({ req }) and gets back null because there is nothing to read. The middleware then returns NextResponse.redirect to /auth?mode=login. The user lands on the login page. If they try to go back to /dashboard again, the same thing happens the middleware catches it every single time.

**What goes wrong if ignored:**
If the middleware was not there, anyone with the dashboard URL could access it directly without logging in. Sensitive user data would be exposed to anyone who knew or guessed the URL.

---

### Q12 — Kerckhoffs's Principle + Technical Debt

**Code reference:** `.gitignore`, `.env.local`, `.env`

**My Answer:**
This almost happened to me twice. The first time was during the build — I had set up `.env.local` myself, but at some point OpenCode also created a `.env` file, and the secrets ended up in both files. OpenCode flagged it and warned me that `.env` was not in `.gitignore`. I realised that if I had pushed at that point, all my secrets would have been public on GitHub. We fixed it by removing everything from `.env` and keeping the secrets only in `.env.local`. When I checked the `.env` file after, it just had a comment pointing to `.env.local` — nothing sensitive left in it.

The second thing that happened was more personal. I took a screenshot of my code to share while debugging an issue, and I did not realise some of my secret keys were visible in the screenshot. I had already shared it before I noticed. I had to immediately go and reset the password of the affected key to make it invalid.

**What goes wrong if ignored:**
A leaked secret key means anyone who sees it can use it. In the case of `NEXTAUTH_SECRET` specifically, an attacker could forge session tokens and log in as any user without knowing their password. You have to rotate the key immediately and invalidate all existing sessions.

---

### Q13 — Conway's Law

**Code reference:** Full project folder structure

**My Answer:**
Looking at my folder structure, I can see that it reflects how my brain thinks about the project. I did not consciously plan it this way — it just ended up organised by concern. When I need anything related to the database, I go straight to `prisma/schema.prisma`. When I need anything about authentication logic, I go to `src/lib/auth.ts`. When I need the API routes — the backend handlers — I go to `src/app/api/`. When I need the forms and UI, I go to `src/components/` where I have `LoginForm.tsx`, `SignupForm.tsx`, and `ForgotPasswordForm.tsx`. The `emails/` folder holds the email templates, and `src/lib/` holds all the shared utilities like `ratelimit.ts`, `prisma.ts`, and `email.tsx`. Each folder has one job, and I always know where to look.

**What goes wrong if ignored:**
If everything was just dumped in one folder with no structure, finding anything would be a nightmare. As the project grows, you would have no idea where authentication ends and the UI begins.

---

### Q14 — Technical Debt

**Code reference:** `src/lib/ratelimit.ts`

**My Answer:**
The rate limiter uses an in-memory Map to track login attempts. It works right now  I tested it and it blocks after five attempts. But I later learned that every time the server restarts or redeploys on Vercel, that Map resets to zero, meaning someone who was blocked can just try again after a redeploy. When I was building it, I did not know this would happen I only found out later. The proper solution would be to store the attempts in the database so the data survives restarts. I left it as it is because it met the assignment requirements, but if this were a real production app, the rate limiter would be the first thing I would replace.

**Refactored version:**
```ts
import { prisma } from "@/lib/prisma"

export async function checkRateLimit(
  ip: string,
  maxAttempts: number,
  windowMs: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs)
  const count = await prisma.rateLimitAttempt.count({
    where: { ip, createdAt: { gte: windowStart } },
  })
  if (count >= maxAttempts) return false
  await prisma.rateLimitAttempt.create({ data: { ip } })
  return true
}
```

**What goes wrong if ignored:**
On a platform like Vercel that redeploys frequently, the rate limit resets constantly. An attacker could time their brute force attempts around deployments and never actually get blocked.

---

### Q15 — Synthesis: Adding Payments to SecureGate

**Code reference:** All principles from this document

**My Answer:**
If I added Flutterwave to SecureGate, every principle from this project would still apply.

**YAGNI** I would only build exactly what is required. If the requirement is that a user pays and gets access, that is all I build. No multi-currency, no subscription tiers, no invoicing unless someone actually asks for it.

**Kerckhoffs's Principle + Environment Variables** The Flutterwave secret key cannot be exposed anywhere. Not in the code, not in a screenshot, not in GitHub. I already learned that lesson the hard way during this project when I accidentally shared a screenshot with a secret key visible and had to reset it immediately. When money is involved, that mistake is even more serious.

**Murphy's Law** Payments can go wrong in ways you do not expect. A user could pay and the confirmation webhook never arrives. Or the webhook arrives twice. I would have to handle both situations — making sure a user who paid actually gets access, and making sure a duplicate webhook does not give them double access.

**Rate Limiting** The payment endpoint would need rate limiting just like the login endpoint. You would not want someone submitting the payment form hundreds of times and creating dozens of pending transactions.

**Postel's Law + Error Messages** The payment endpoint should not reveal internal details when something goes wrong. Just like the forgot password flow always returns the same message, payment errors should be clean and not expose anything about the system underneath.

**Principle of Least Surprise** After paying, the user expects to immediately see their premium dashboard. If they have to wait, refresh, or wonder if the payment went through, trust is lost.

**Gall's Law** I would not try to build the full payment system all at once. I would do it phase by phase — first just get the Flutterwave redirect working, then handle the webhook, then unlock the dashboard, then test edge cases.

**Technical Debt** The in-memory rate limiter I mentioned in Q14 would become a much bigger problem with payments involved. I would have to fix that first before adding any payment logic.

**Conway's Law** I would create a dedicated folder or module just for payment logic, separate from auth. Mixing payment code with auth code would make both harder to understand and maintain.

The principles that become most critical when money is involved are Kerckhoffs's Principle, Murphy's Law, and rate limiting because a mistake in any of those does not just inconvenience a user, it costs real money or exposes financial data.

**What goes wrong if ignored:**
A leaked payment API key means an attacker can interact with your Flutterwave account directly. An unhandled duplicate webhook could charge users twice. And without YAGNI discipline, you end up building features nobody needs while the core payment flow has bugs.

---

## Part 4 — One Thing I Would Refactor

The rate limiter. When I was building it, I did not know that the in-memory Map would reset every time the server redeploys on Vercel. I only found out later. It works right now it blocks after five attempts but every time Vercel redeploys the project, the counter resets to zero and someone who was blocked can just try again. The fix would be to store the attempts in the database instead, so the data survives restarts and redeploys. I left it as it is because it met the assignment requirements, but if this were a real production app, the rate limiter would be the first thing I would upgrade.

```ts
import { prisma } from "@/lib/prisma"

export async function checkRateLimit(
  ip: string,
  maxAttempts: number,
  windowMs: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs)
  const count = await prisma.rateLimitAttempt.count({
    where: { ip, createdAt: { gte: windowStart } },
  })
  if (count >= maxAttempts) return false
  await prisma.rateLimitAttempt.create({ data: { ip } })
  return true
}
```

---

## Part 5 — How This Changes How I Build

Before SecureGate, I thought authentication was just writing some code, putting in a login form, and that was it. I had no idea how much was actually involved.

I did not know passwords were hashed. I genuinely thought that when you type your password, it gets stored in the database exactly as you typed it. Building SecureGate showed me that what is actually stored is a completely unreadable string and that is intentional.

I also did not know that people could manipulate URLs and links. When I discovered during testing that I could modify the reset password URL and still get through, that shocked me. I had never thought about that kind of attack before.

The thing that surprised me the most was the error messages. I have encountered "Invalid credentials" on other apps before SecureGate and I always thought it was lazy or bad UX. I used to think 'just tell me if it is my email or my password that is wrong'. I did not know there was a security reason behind it. Same with the forgot password message I have been in situations where I typed my email, got told a reset link was sent, checked my inbox and found nothing. I used to think the app was broken. Now I know it was protecting me it was not going to confirm whether my email existed or not.

SecureGate changed how I see every app I use now. I look at error messages differently. I understand why certain things feel vague. I know what is happening behind the scenes.
