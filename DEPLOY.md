# Deployment Guide — Portfolio

## Overview

- **Frontend (React + Vite)** → Vercel
- **Backend (Express + MongoDB)** → Render
- **Database** → MongoDB Atlas (already configured)

---

## 1. Deploy Backend to Render

### 1.1 Create Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect your GitHub repository
3. Fill in the settings:

| Setting | Value |
|---------|-------|
| **Name** | `portfolio-api` (or any name) |
| **Region** | Singapore (closest to you) |
| **Branch** | `main` |
| **Root Directory** | `apps/api` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

### 1.2 Add Environment Variables

Go to **Environment** tab and add these:

```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.vercel.app,http://localhost:5173
MONGODB_URI=mongodb+srv://Ph4tZ4:P%40ssw0rd@portfolio.bskotxs.mongodb.net/portfolio
JWT_SECRET=<GENERATE_A_STRONG_SECRET>
```

> Render sets `NODE_ENV=production`, so `npm install` may skip `devDependencies`.
> The build needs `typescript` and `@types/*`, so use `npm install --include=dev && npm run build`.

> **Generate JWT_SECRET**: Run this in terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```
> Copy the output and paste as `JWT_SECRET`

### 1.3 Important Notes
- Render free tier spins down after 15 min idle. First request may take 30-60 sec to wake up.
- Copy the deployed URL: `https://portfolio-api-xxxx.onrender.com`
- You will need this URL for the frontend

---

## 2. Deploy Frontend to Vercel

### 2.1 Import Project
1. Go to [vercel.com](https://vercel.com) → **Add New...** → **Project**
2. Import your GitHub repository
3. In the configure screen:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `apps/web` |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` (default) |

### 2.2 Add Environment Variables

Click **Environment Variables** and add:

```
VITE_API_BASE_URL=https://portfolio-api-xxxx.onrender.com
```

> Replace with your actual Render URL from step 1.3

### 2.3 Deploy
Click **Deploy**. Vercel will build and give you a URL like:
`https://portfolio-xyz.vercel.app`

---

## 3. Update Backend CORS (One-time)

After getting your Vercel URL, go back to Render dashboard:

1. Go to your Web Service → **Environment**
2. Update `CORS_ORIGIN` to include your Vercel domain:

```
CORS_ORIGIN=https://portfolio-xyz.vercel.app,http://localhost:5173
```

> Use comma to separate multiple origins. Keep `localhost:5173` for local dev.

3. Click **Manual Deploy** → **Clear Build Cache & Deploy**

---

## 4. Verify Everything Works

Open your Vercel URL and check:
1. Portfolio page loads correctly
2. Admin login works (`/admin`)
3. Can edit and save data

If CORS errors appear in browser console, double-check the `CORS_ORIGIN` value in Render matches your Vercel URL exactly (including `https://`).

---

## Quick Reference — All Env Variables

### Render (Backend)
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-vercel-url.vercel.app,http://localhost:5173
MONGODB_URI=mongodb+srv://Ph4tZ4:P%40ssw0rd@portfolio.bskotxs.mongodb.net/portfolio
JWT_SECRET=<64-char-random-hex>
```

### Vercel (Frontend)
```
VITE_API_BASE_URL=https://your-render-url.onrender.com
```

---

## Troubleshooting — Vercel Opens but Data/Login Does Not Work

If the browser console shows `404` for `/api/auth/login`, `/api/auth/me`, or `/api/portfolio`, check this first:

### 1. Set Vercel API URL

In Vercel → Project → **Settings** → **Environment Variables**, add:

```
VITE_API_BASE_URL=https://ph4tz4-server.onrender.com
```

Then redeploy the frontend:

1. Go to **Deployments**
2. Click the latest deployment menu
3. Click **Redeploy**

### 2. Set Render CORS Origin

In Render → Web Service → **Environment**, make sure `CORS_ORIGIN` includes your real Vercel URL:

```
CORS_ORIGIN=https://ph4tz4.vercel.app,http://localhost:5173
```

Then restart/redeploy the Render service.

### 3. Seed Production Database

If API works but the portfolio is empty, seed the production MongoDB once:

```bash
cd apps/api && npm run seed
```

Make sure your local `apps/api/.env` points to the same Atlas database used by Render before running seed.

Alternatively, log in to `/admin`, add/edit data, and click save. The backend will create the portfolio document automatically.

---

## Local Development (after deploy)

For local dev, create `apps/web/.env.local`:
```
VITE_API_BASE_URL=http://localhost:4000
```

And ensure `apps/api/.env` has:
```
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://Ph4tZ4:P%40ssw0rd@portfolio.bskotxs.mongodb.net/portfolio
JWT_SECRET=dev-jwt-secret-change-me-in-production
PORT=4000
```
