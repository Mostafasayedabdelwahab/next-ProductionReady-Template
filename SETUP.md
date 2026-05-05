# Project Setup Guide

This guide explains how to run the project locally from scratch.

> For project architecture, features, and security overview, see `README.md`.

---

# Requirements

Make sure you have the following installed:

- Node.js 18+
- npm
- PostgreSQL Database
  - Neon
  - Supabase
  - Local PostgreSQL
- Git

---

# Check Installed Versions

```bash
node -v
npm -v
```

---

# Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

---

# Install Dependencies

```bash
npm install
```

This will automatically run:

```bash
prisma generate
```

via the `postinstall` script.

---

# Environment Variables

Create a local `.env` file:

```bash
cp .env.example .env
```

Fill all required values inside `.env`.

---

# Required External Services

The project depends on the following services:

- PostgreSQL Database
- Cloudinary
- Email Provider
- Upstash Redis (optional for rate limiting)

---

# Database Setup

## Development

```bash
npx prisma migrate dev
```

## Production

```bash
npx prisma migrate deploy
```

---

# Generate Prisma Client

Optional manual generation:

```bash
npx prisma generate
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

If the homepage loads successfully, the setup is complete.

---

# Production Build

```bash
npm run build
npm start
```

---

# Common Commands

## Prisma Studio

```bash
npx prisma studio
```

## Reset Database

```bash
npx prisma migrate reset
```

---

# Important Notes

- Ensure all environment variables are configured correctly
- Use Node.js version 18 or higher
- Never commit `.env` files
- Keep all secrets server-side only
- Cloudinary uploads require valid API credentials
- Cron jobs require `CRON_SECRET`

---

# Troubleshooting

## Prisma Client Issues

Run:

```bash
npx prisma generate
```

---

## Database Connection Errors

Verify:

- `DATABASE_URL`
- SSL configuration
- PostgreSQL server availability

---

## Cloudinary Upload Issues

Verify:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

# Additional Documentation

- `README.md` → Project overview and architecture
- `.env.example` → Required environment variables