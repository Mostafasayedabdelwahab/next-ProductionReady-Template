# Project Setup Guide

This document explains how to run the project locally from scratch.

> If you are looking for an overview of the project architecture and features,  
> see `README.md`.

---
## Requirements

Make sure you have the following installed:

- Node.js **18+**
- npm (comes with Node.js)
- PostgreSQL database (Neon / Supabase / Local)
- Git

Check versions:

```bash
node -v
npm -v

1. Clone the Repository
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>

2. Install Dependencies
npm install
This will also run prisma generate automatically.

3. Environment Variables
Create a local .env file:
cp .env.example .env
Fill the required values in .env.

4. Database Setup
Development: npx prisma migrate dev
Production: npx prisma migrate deploy
Optional (generate client manually if needed): npx prisma generate

5. Run the Development Server
npm run dev
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
If the homepage loads, the setup is successful.

Final Notes
Ensure all environment variables are set correctly
Use Node.js version 18 or higher
For architecture and security details, refer to README.md
```
