# Mini SaaS – Production Ready Template

Production-ready Next.js SaaS with secure authentication
and clean architecture.

## Getting Started

First, run the development server:

```bash
npm install
npx prisma migrate dev
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js (App Router)
- TypeScript
- NextAuth (Credentials)
- Prisma + PostgreSQL
- Cloudinary (Uploads)
- Resend (Emails)
- Vercel (Cron Jobs)

## Architecture Overview

The project follows a clean, scalable architecture:

- `app/`
  UI, routing, and API routes (thin controllers)

- `features/`
  Business logic organized by domain (profile, user, cron)

- `lib/`
  Infrastructure, guards, auth, prisma, external services

- `types/`
  Shared TypeScript types and NextAuth module augmentation

## Authentication Flow

- Authentication is handled using NextAuth with Credentials provider.
- Sessions are cookie-based (no localStorage, no tokens on the client).
- All protected APIs rely on server-side guards.

## Security Notes

- All authentication logic is server-side.
- Sessions are invalidated on sensitive actions.
- Password reset tokens are hashed before storage.
- No user enumeration in auth flows.

## Guards

- `requireVerifiedUser`
  - Ensures user is authenticated
  - Email is verified
  - Account is active
  - Session is still valid

## Cron Jobs

- Implemented using Vercel Cron Jobs
- Secured via `CRON_SECRET`
- Business logic lives in `features/cron`

## Environment Variables

Required environment variables:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- RESEND_API_KEY
- APP_URL
- FROM_EMAIL
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- EMAIL_FROM
- CRON_SECRET

## Planned Improvements

- Rate limiting for auth endpoints
- Audit logs for security events
- Role-based access control
```
