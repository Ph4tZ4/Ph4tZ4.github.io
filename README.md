# Kittiphat — Full-Stack Portfolio

A structured full-stack rewrite of the portfolio. Instead of the browser loading
data directly from Firestore (which caused multi-minute waits on first paint),
the site now reads from a fast REST API backed by **MongoDB**. Firebase is used
only for **admin authentication**.

```
apps/
  web/   React + Vite + TypeScript + Tailwind  (public site + /admin panel)
  api/   Express + TypeScript + Mongoose + Firebase Admin  (REST API)
```

## Architecture

- **Frontend (`apps/web`)** fetches portfolio content from `GET /api/portfolio`
  on load — a single, fast MongoDB-backed request. The `/admin` route (hash route
  `#/admin`) logs in via Firebase Auth and edits content.
- **Backend (`apps/api`)** exposes:
  - `GET  /api/portfolio` — public, returns the portfolio document.
  - `PUT  /api/portfolio` — protected; requires a Firebase ID token whose email is
    in `ADMIN_EMAILS` (or any authenticated user if the list is empty).
  - `GET  /api/health` — health check.
- **Database**: MongoDB stores a single `Portfolio` document (`about`, `skills`,
  `projects`, `certificates`). Firebase Admin verifies admin ID tokens.

## Prerequisites

- Node.js 18+
- A running MongoDB (default `mongodb://127.0.0.1:27017/portfolio`)

## Setup

```bash
npm install

# configure environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# edit both .env files with your values

# import existing content into MongoDB (uses the latest backup JSON in repo root)
npm run seed

# start both servers (api: http://localhost:4000, web: http://localhost:5173)
npm run dev
```

## Environment variables

`apps/api/.env`
- `PORT`, `CORS_ORIGIN`, `MONGODB_URI`
- Firebase Admin: either `GOOGLE_APPLICATION_CREDENTIALS` (path to service account
  JSON) **or** inline `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` /
  `FIREBASE_PRIVATE_KEY`.
- `ADMIN_EMAILS` — comma-separated allowlist of admin emails (blank = any signed-in user).

`apps/web/.env`
- `VITE_FIREBASE_*` — Firebase Web SDK config (only needed for `/admin`).
- `VITE_API_BASE_URL` — blank in dev (uses the Vite proxy at `/api`); set to the
  deployed API origin in production.

## Admin access

1. Create an email/password user in Firebase Authentication.
2. Provide Firebase Admin credentials to the API and the matching Web config.
3. Visit `/#/admin`, sign in, edit, and **Save changes** (writes to MongoDB).

> Without Firebase credentials the public site still works fully; only admin
> writes are disabled.

## Scripts

- `npm run dev` — run API + web together
- `npm run dev:api` / `npm run dev:web` — run individually
- `npm run seed` — seed MongoDB from the backup JSON
- `npm run build` — build both apps

## Legacy

The original static files (`index.html`, `data-manager.js`, `dashboard.html`,
etc.) remain in the repo root for reference and can be removed once the new stack
is verified.