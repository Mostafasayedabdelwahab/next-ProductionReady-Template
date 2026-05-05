# nextjs-starter-pro

A scalable and security-focused Next.js SaaS starter built with modern
best practices, clean architecture, and production-grade patterns.

Designed for developers who want a solid foundation for real-world SaaS
applications instead of tutorial-level boilerplates.

---

## Features

- Next.js App Router
- TypeScript
- NextAuth Authentication (Credentials Provider)
- Prisma ORM + PostgreSQL
- Cloudinary Secure Uploads
- Role-Based Access Control (RBAC)
- Email Verification Flow
- Password Reset Flow
- Secure Session Management
- Server-Side Guards
- Internationalization (i18n)
- Theme System
- Dynamic Site Settings
- Vercel Cron Jobs
- Rate Limiting Support
- Production Security Headers (CSP)
- Clean Feature-Based Architecture

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- Zod

### Backend
- NextAuth
- Prisma ORM
- PostgreSQL

### Services
- Cloudinary
- Nodemailer
- Upstash Redis
- Vercel Cron Jobs

---

## Security Features

- Authentication handled completely server-side
- Cookie-based sessions (No localStorage auth)
- Email verification enforcement
- Password reset tokens hashed before storage
- Session invalidation support
- Route protection via server guards
- Content Security Policy (CSP)
- Secure HTTP Headers
- Protected Cloudinary signed uploads
- Cron endpoint protection using `CRON_SECRET`
- No sensitive logic exposed to the client
- No user enumeration in authentication flows

---

## Project Structure

```bash
src/
├── app/               # App Router pages, layouts, API routes
├── components/        # Shared UI and form components
├── config/            # Constants, enums, fonts, icons
├── features/          # Feature-based business logic
├── guards/            # Authentication and role guards
├── i18n/              # Localization system
├── lib/               # Infrastructure and external services
├── loaders/           # Server data loaders
├── schemas/           # Shared Zod schemas
├── services/          # Shared services
├── types/             # Shared TypeScript types
├── utils/             # Utility helpers
└── generated/         # Generated Prisma client
```

---

## Authentication Flow

Authentication is implemented using NextAuth Credentials Provider.

### Authentication Includes

- Login
- Register
- Email Verification
- Forgot Password
- Reset Password
- Session Validation
- Role Protection

### Session Strategy

- Secure cookie-based sessions
- No JWT stored in localStorage
- Server-side validation on protected routes
- Session invalidation on sensitive actions

---

## Role-Based Access Control

Supported roles:

```txt
USER
EDITOR
ADMIN
```

Server guards:

- `requireAuthUser`
- `requireUser`
- `requireEditor`
- `requireAdmin`

---

## File Uploads

Secure Cloudinary upload flow using signed upload requests.

### Upload Security

- Signed uploads only
- Server-generated upload signatures
- Authenticated upload access
- Upload folder isolation
- Media metadata persistence

---

## Internationalization

Built-in localization system with support for:

- Arabic
- English

Features include:

- Locale routing
- Translation dictionaries
- RTL support
- Localized metadata helpers

---

## Site Settings System

Dynamic site settings management:

- SEO metadata
- Site branding
- Theme customization
- Font management
- Social links
- Contact information
- Open Graph images

---

## Cron Jobs

Implemented using Vercel Cron Jobs.

### Features

- Secure cron protection
- Server-side cleanup services
- Centralized cron business logic

---

## Environment Variables

Required environment variables are available in:

```bash
.env.example
```

---

## Getting Started

See `SETUP.md`.

---

## Production Build

```bash
npm run build
npm start
```

---

## Architecture Philosophy

This project follows a feature-based architecture with strict separation
between:

- UI Layer
- Business Logic
- Infrastructure
- Authentication
- Data Access

The goal is maintainability, scalability, and production readiness.

---

## Version

```txt
v1.2.0
```

---

## Additional Documentation

- `SETUP.md` → Getting Started
- `.env.example` → Required environment variables