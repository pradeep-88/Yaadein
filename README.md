# Yaadein — Image Storage Platform

A full-stack web app for organizing and sharing images. Create folders, upload images with metadata (title, description, tags), and get QR codes for each image. Supports email/password and **Sign in with Google**, with an admin dashboard for user and content management.

---

## Features

- **Authentication**
  - Email + password (register / login)
  - **Sign in with Google** (OAuth 2.0)
  - JWT-based sessions; optional account linking (same email for both)
- **Dashboard**
  - Create folders, search and sort
  - Upload images (drag-and-drop) with title, description, tags
  - Images stored on **Cloudinary**; QR code generated per image
  - View folder contents, delete folders/images (owner or admin)
- **Admin**
  - Overview (user/folder/image counts)
  - List and delete users, folders, images
- **UI**
  - Responsive layout, light/dark theme
  - Confirm dialogs for destructive actions
  - Toasts for success/error

---

## Tech Stack

| Layer    | Stack |
|----------|--------|
| Frontend | React 19, Vite 7, React Router, Tailwind CSS, Axios, React Hot Toast |
| Backend  | Node.js, Express 5, Mongoose (MongoDB) |
| Auth     | JWT, bcrypt, Google OAuth 2.0 |
| Storage  | MongoDB (users, folders, metadata), Cloudinary (images) |

---

## Project Structure

```
ISP/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/     # auth, upload, admin, Google OAuth
│   ├── middleware/      # JWT auth, admin check
│   ├── models/          # User, Folder, Image
│   ├── routes/          # auth, upload, admin
│   ├── utils/            # e.g. Google Vision (optional)
│   ├── server.js        # Entry point
│   ├── .env.example      # Env template
│   └── GOOGLE-SIGNIN-SETUP.md   # Google OAuth setup guide
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── contexts/    # AuthContext
│   │   ├── features/    # auth, dashboard, admin
│   │   ├── layouts/     # MainLayout, AdminLayout
│   │   ├── pages/       # Login, Dashboard, Folder, About, AuthCallback, NotFound
│   │   ├── services/    # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── router/      # Routes
│   ├── .env             # VITE_BACKEND_URL
│   └── index.html
```

---

## Prerequisites

- **Node.js** 18+ and **npm**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- (Optional) **Google Cloud** account for “Sign in with Google”
- (Optional) **Cloudinary** account for image uploads

---

## Environment Setup

### 1. Backend (`.env` in `backend/`)

Copy the example and edit with your values:

```bash
cd backend
cp .env.example .env
```

Required:

| Variable | Description | Example |
|----------|-------------|--------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/yaadein` or Atlas URI |
| `JWT_SECRET` | Secret for signing JWTs (long random string) | `my-super-secret-key-min-32-chars` |

Optional but recommended:

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (for “Sign in with Google”) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client secret |
| `GOOGLE_CALLBACK_URL` | Backend callback URL, e.g. `http://localhost:5000/api/auth/google/callback` |
| `FRONTEND_URL` | Frontend origin, e.g. `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Minimal `.env` for local run (no Google, no Cloudinary):**

```env
MONGO_URI=mongodb://localhost:27017/yaadein
JWT_SECRET=your-secret-at-least-32-characters-long
```

For **Google Sign-In**, see **[backend/GOOGLE-SIGNIN-SETUP.md](backend/GOOGLE-SIGNIN-SETUP.md)**.

### 2. Frontend (`.env` in `frontend/`)

Create `frontend/.env`:

```env
# Point to your backend API (no trailing slash)
VITE_BACKEND_URL=http://localhost:5000/api
```

For production, set this to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

---

## How to Run

### 1. MongoDB

- **Local:** Start MongoDB (e.g. `brew services start mongodb-community` on Mac, or `mongod`).
- **Atlas:** Use your cluster’s connection string in `MONGO_URI`.

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

- Server runs at **http://localhost:5000** (or `PORT` from env).
- You should see: `Server running on 5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App runs at **http://localhost:5173** (Vite default).

### 4. Open the app

- In the browser go to **http://localhost:5173**.
- Use **Login** / **Sign up** (email + password or Google, if configured).

---

## How to Use

### Login / Sign up

- **Home (`/`):** Login or Sign up (tabs). Email + password or **Sign in with Google** / **Sign up with Google**.
- **Sign up (`/signup`):** Email + password; optional “Register as Admin” (only the first user in the DB becomes admin).
- After login you are redirected to **Dashboard** (normal user) or **Admin** (admin user).

### Dashboard (`/dashboard`)

- **Folders:** Create folders, search by name, sort by date/name.
- **Per folder:** Open folder (view images), upload images (drag-and-drop), delete folder (with confirmation).
- **Folder page (`/folder/:id`):** Upload images (title, description, tags), view grid, delete images (with confirmation). Each image has an optional QR code.

### Admin (`/admin`)

- **Overview:** Total users, folders, images.
- **Users / Folders / Images:** Tables with delete actions (with confirmation).
- Only users with `isAdmin: true` can access `/admin`.

### About (`/about`)

- Short product and tech stack description.

### Logout

- Use **Logout** in the main nav; you are sent back to the login page.

---

## API Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST   | `/api/auth/register` | No  | Register (email, password) |
| POST   | `/api/auth/login`    | No  | Login (email, password) |
| GET    | `/api/auth/google`   | No  | Redirect to Google OAuth |
| GET    | `/api/auth/google/callback` | No | OAuth callback; redirects to frontend with token |
| POST   | `/api/upload/folder`  | Yes | Create folder |
| GET    | `/api/upload/folders` | Yes | List folders (owner or admin) |
| POST   | `/api/upload/image`   | Yes | Upload image (base64, folderId, metadata) |
| GET    | `/api/upload/images/:folderId` | Yes | List images in folder |
| DELETE | `/api/upload/folder/:id`  | Yes | Delete folder (owner or admin) |
| DELETE | `/api/upload/image/:id`   | Yes | Delete image (owner or admin) |
| GET    | `/api/admin/overview` | Admin | Counts |
| GET    | `/api/admin/users`   | Admin | List users |
| GET    | `/api/admin/folders` | Admin | List folders |
| GET    | `/api/admin/images`  | Admin | List images |
| DELETE | `/api/admin/user/:id`   | Admin | Delete user |
| DELETE | `/api/admin/folder/:id` | Admin | Delete folder |
| DELETE | `/api/admin/image/:id`   | Admin | Delete image |

Protected routes expect header: `Authorization: Bearer <JWT>`.

---

## Scripts

### Backend (`backend/`)

- `npm run dev` — run with nodemon (restart on file change)
- `npm start` — run with `node server.js`

### Frontend (`frontend/`)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

---

## Optional: Google Sign-In

1. Follow **[backend/GOOGLE-SIGNIN-SETUP.md](backend/GOOGLE-SIGNIN-SETUP.md)** to get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
2. Add them (and `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`) to `backend/.env`.
3. Restart the backend. “Sign in with Google” and “Sign up with Google” will then work.

---

## Optional: Cloudinary (Image Uploads)

1. Create a [Cloudinary](https://cloudinary.com) account and get cloud name, API key, and API secret.
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `backend/.env`.
3. Restart the backend. Image uploads will be stored on Cloudinary and QR codes will still be generated.

---

## Deployment: Frontend (Vercel) + Backend (Render)

Deploy the **backend first** so you have an API URL, then deploy the **frontend** pointing to it.

---

### 1. Deploy Backend on Render

1. **Push your code** to GitHub (backend must be in the repo; monorepo with `backend/` folder is fine).

2. **Create a Web Service** on [Render](https://render.com):
   - Dashboard → **New** → **Web Service**.
   - Connect your GitHub repo and select it.
   - **Settings:**
     - **Root Directory:** `backend`
     - **Runtime:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance type:** Free (or paid if you need no cold starts).

3. **Environment variables** (Render → your service → **Environment**):
   - `MONGO_URI` — MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/yaadein`)
   - `JWT_SECRET` — Long random string (e.g. 32+ chars)
   - `FRONTEND_URL` — Your Vercel app URL **with no trailing slash** (e.g. `https://your-app.vercel.app`). Used for CORS and Google OAuth redirects.
   - Optional: `CLOUDINARY_*`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` (see below).

4. **Save** and let Render build and deploy. Note your backend URL, e.g. `https://your-backend.onrender.com`.  
   - Free tier may spin down after inactivity; first request can be slow (cold start).

5. **Google OAuth (if used):** In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth client:
   - Add **Authorized redirect URI:** `https://your-backend.onrender.com/api/auth/google/callback`
   - In Render env, set `GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback` and `FRONTEND_URL=https://your-app.vercel.app`.

---

### 2. Deploy Frontend on Vercel

1. **Create a project** on [Vercel](https://vercel.com):
   - **Add New** → **Project** → Import your GitHub repo.
   - **Root Directory:** set to `frontend` (not the repo root).
   - **Framework Preset:** Vite (auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default for Vite).

2. **Environment variable:**
   - Add **Variable:** `VITE_BACKEND_URL` = `https://your-backend.onrender.com/api`  
     (use your real Render URL; **no trailing slash**).

3. **Deploy.** Vercel will build and give you a URL like `https://your-app.vercel.app`.

4. **SPA routing:** The repo includes `frontend/vercel.json` so routes like `/dashboard` and `/folder/:id` work (all requests fall back to `index.html`).

5. **Point backend at frontend:** In Render, ensure `FRONTEND_URL` is set to your Vercel URL (e.g. `https://your-app.vercel.app`) so CORS and Google redirects work.

---

### 3. Quick checklist

| Where   | Variable / Setting        | Value / Note                                      |
|--------|---------------------------|---------------------------------------------------|
| Render | `MONGO_URI`               | MongoDB Atlas URI                                 |
| Render | `JWT_SECRET`              | Long random secret                                |
| Render | `FRONTEND_URL`            | `https://your-app.vercel.app` (no trailing slash) |
| Render | `GOOGLE_CALLBACK_URL`     | `https://your-backend.onrender.com/api/auth/google/callback` (if using Google) |
| Vercel | `VITE_BACKEND_URL`        | `https://your-backend.onrender.com/api` (no trailing slash) |
| Google | Authorized redirect URI   | Same as `GOOGLE_CALLBACK_URL`                     |

---






