# SecureGate — Code Style Rules

## Language
- TypeScript everywhere — no plain .js files in src/
- Use explicit types — avoid 'any'
- Use async/await — no .then() chains

## Naming Conventions
- Files: kebab-case for folders, PascalCase for components (AuthForm.tsx)
- Variables and functions: camelCase
- Types and interfaces: PascalCase with descriptive names
- Database models: PascalCase (User, VerificationToken)
- API routes: lowercase (signup, forgot-password)

## API Routes
- Every route must be wrapped in try/catch
- Always return a proper HTTP status code:
  - 200: success
  - 400: bad request / validation failed
  - 401: not authenticated
  - 403: forbidden (authenticated but not verified)
  - 429: rate limit exceeded
  - 500: server error (return generic message, not the real error)
- Always return JSON: { message: "..." } or { error: "..." }

## Components
- Every form input must have a label
- Every button must have a loading state
- Show real, specific error messages — not "Something went wrong"
- Forms must show validation errors inline (under each field)

## Imports
- Use absolute imports from src/ (configure in tsconfig.json)
- Group imports: external packages first, then internal files
- Remove unused imports before committing

## Prisma
- Always use the singleton pattern for the Prisma client (see lib/prisma.ts)
- Never create a new PrismaClient() inside a route handler
- Always handle Prisma errors — wrap in try/catch

## Environment Variables
- Access via process.env.VARIABLE_NAME
- If a required variable is missing, throw an error with a clear message
