# SecureGate — Design System Rules

## Overall Style
- Clean, minimal, professional — this is a security app, not a social network
- Dark mode optional but not required
- Mobile-first responsive design using Tailwind CSS
- Consistent spacing, typography, and color across all pages

## Color Palette (Tailwind classes)
- Background: bg-gray-50 (page), bg-white (cards/forms)
- Primary action: bg-blue-600 hover:bg-blue-700
- Danger/Error: text-red-600, border-red-300, bg-red-50
- Success: text-green-600, bg-green-50
- Text primary: text-gray-900
- Text secondary: text-gray-500
- Borders: border-gray-300

## Layout
- All auth pages (login, signup, etc.) centered on screen
- Max width for auth forms: max-w-md
- Use a card layout: bg-white rounded-lg shadow-md p-8
- Add the app name "SecureGate" as a heading above each form

## Form Elements
- All inputs: full width, border, rounded, padding, focus ring
  - Class: w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
- All labels: above the input, font-medium, text-sm, text-gray-700
- Error messages: below the input, text-sm, text-red-600
- Primary button: full width, blue, with loading spinner when submitting

## Password Strength Indicator
Show below the password field on the signup page only:
- Weak: red bar (password < 8 chars or only one character type)
- Fair: yellow bar (8+ chars with 2 character types)
- Strong: green bar (8+ chars with uppercase, lowercase, number, symbol)
- Show the label text: "Weak", "Fair", or "Strong"

## Loading States
- Buttons must show a spinner and be disabled while a request is in progress
- Use a simple animated spinner (Tailwind animate-spin)
- Button text changes: "Sign In" → "Signing in..."

## Error & Success Messages
- Show at the top of the form, inside a colored banner
- Error: bg-red-50 border border-red-200 text-red-700 rounded p-3
- Success: bg-green-50 border border-green-200 text-green-700 rounded p-3
- Messages must be specific — never say "Something went wrong"

## Pages
- /login — Email + Password fields, "Forgot password?" link, link to /signup
- /signup — Name + Email + Password fields, password strength indicator
- /forgot-password — Email field only
- /reset-password/[token] — New password + Confirm password fields
- /verify-email/[token] — No form, just a status message (verifying/success/error)
- /dashboard — Welcome message showing the user's name, logout button
