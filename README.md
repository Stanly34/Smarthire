# SmartHire - AI Based College Placement Platform

A full-stack web application connecting students and companies through intelligent skill matching, coding assessments, and streamlined campus recruitment.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web UI | React 18 + Vite + TailwindCSS |
| API | Node.js + Express.js |
| Database | PostgreSQL / Supabase |
| Auth | JWT + bcrypt |
| Chat | REST API polling |
| Charts | Recharts |

---

## Project Structure

```text
New/
├── api/[...path].js          # Vercel API entrypoint
├── server.js                 # Express API server
├── package.json              # Single root package
├── index.html                # Vite HTML entry
├── vite.config.mjs
├── tailwind.config.cjs
├── postcss.config.cjs
├── src/                      # React app
├── controllers/              # API controllers
├── routes/                   # API routes
├── middleware/               # JWT middleware
├── db/                       # PostgreSQL pool + schema
├── scripts/                  # DB checks and demo seeding
└── docs/
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL 14+ or Supabase PostgreSQL
- npm

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Create `.env` in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smarthire
JWT_SECRET=smarthire_super_secret_jwt_key_2025
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

For Supabase, use the pooler value documented in `docs/supabase.md`.

### Step 3: Setup Database

For local PostgreSQL:

```bash
psql -U postgres -c "CREATE DATABASE smarthire;"
psql -U postgres -d smarthire -f db/schema.sql
```

For Supabase, run the contents of `db/schema.sql` in the Supabase SQL Editor.

### Step 4: Start The App

```bash
npm run dev
```

API runs at `http://localhost:5000`.
Vite runs at `http://localhost:5173`.

You can also run each side separately:

```bash
npm run dev:api
npm run dev:web
```

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smarthire.com | password |

Students and companies must register and get approved by the admin.

---

## Features

### Admin Panel

- View real-time stats: students, companies, jobs, applications, placements
- Approve/reject student and company registrations
- Analytics charts: top skills, departments, jobs per company
- View all jobs and applications

### Student Features

- Profile with skills, CGPA, resume, bio
- AI-powered job matching with percentage score
- Browse and apply for jobs
- Track application status
- Coding practice in practice and scored modes
- Chat with companies through REST polling

### Company Features

- Company profile management
- Post jobs with required skills, min CGPA, min coding score
- View applicants with status management
- AI-filtered eligible students list
- Chat with students through REST polling

### AI Skill Matching

```text
matchPercent = (matched skills / required skills) x 100
eligible = matchPercent >= 50 AND cgpa >= minCGPA AND codingScore >= minScore
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register-student | Student registration |
| POST | /api/auth/register-company | Company registration |
| POST | /api/auth/login | Login |
| GET | /api/students/me | Get student profile |
| PUT | /api/students/me | Update profile and skills |
| GET | /api/students/matched-jobs | AI matched jobs |
| GET | /api/companies/me | Company profile |
| GET | /api/jobs | Browse open jobs |
| POST | /api/jobs | Post a job |
| POST | /api/applications | Apply to a job |
| GET | /api/applications/my | My applications |
| GET | /api/applications/job/:id | Job applicants |
| PUT | /api/applications/:id/status | Update status |
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/pending-users | Pending approvals |
| PUT | /api/admin/approve-user/:id | Approve user |
| GET | /api/coding/problems | Coding problems |
| POST | /api/coding/submit | Submit code |
| GET | /api/chat/messages/:userId | Get messages |
| POST | /api/chat/send | Send message |

---

## Useful Commands

```bash
npm run dev
npm run build
npm run preview
npm run start
npm run db:check
npm run seed:demo
```

---

## One-Project Vercel Deployment

This repo deploys as one Vercel project:

- Vercel installs with `npm ci`.
- Vercel builds with `npm run build`.
- Static assets are served from `dist`.
- `/api/*` requests are handled by the Express app through `api/[...path].js`.
- React routes are rewritten to `index.html` for SPA navigation.

Required Vercel environment variables:

```env
DATABASE_URL=postgresql://postgres.uvyibxbwpzmpqbkbdvsk:YOUR_URL_ENCODED_DB_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=false
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=production
```

Optional environment variables:

```env
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

Do not set `VITE_API_URL` for the Vercel deployment. The web app uses relative `/api` requests so UI and API stay on the same domain.

Before validating login or dashboard data, run the schema against Supabase using the SQL Editor, then optionally verify from this machine:

```bash
npm run db:check
```

See `docs/supabase.md` for the full Supabase setup checklist.
