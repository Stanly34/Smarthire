# SmartHire – AI Based College Placement Platform

A full-stack web application connecting students and companies through intelligent skill matching, coding assessments, and streamlined campus recruitment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| Charts | Recharts |

---

## Project Structure

```
New/
├── backend/
│   ├── server.js              # Express + Socket.io server
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── db/
│   │   ├── index.js           # PostgreSQL pool
│   │   └── schema.sql         # Database schema + seed data
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── adminController.js
│   │   ├── codingController.js
│   │   └── chatController.js
│   └── routes/
│       ├── auth.js
│       ├── students.js
│       ├── companies.js
│       ├── jobs.js
│       ├── applications.js
│       ├── admin.js
│       ├── coding.js
│       ├── chat.js
│       └── skills.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   ├── api.js
        │   └── socket.js
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── SkillTag.jsx
        │   └── StatusBadge.jsx
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── RegisterStudent.jsx
            ├── RegisterCompany.jsx
            ├── Chat.jsx
            ├── student/
            │   ├── StudentDashboard.jsx
            │   ├── StudentProfile.jsx
            │   ├── JobList.jsx
            │   ├── MyApplications.jsx
            │   └── CodingPractice.jsx
            ├── company/
            │   ├── CompanyDashboard.jsx
            │   ├── CompanyProfile.jsx
            │   ├── PostJob.jsx
            │   ├── ViewApplicants.jsx
            │   └── EligibleStudents.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── ManageStudents.jsx
                ├── ManageCompanies.jsx
                └── ManageJobs.jsx
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm

### Step 1: Setup PostgreSQL Database

```sql
-- Open psql or pgAdmin and run:
CREATE DATABASE smarthire;
```

Then apply the schema:
```bash
psql -U postgres -d smarthire -f backend/db/schema.sql
```

### Step 2: Configure Environment

Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smarthire
JWT_SECRET=smarthire_super_secret_jwt_key_2025
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 4: Start the Application

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smarthire.com | password |

> Students and companies must register and get approved by the admin.

---

## Features

### Admin Panel
- View real-time stats: students, companies, jobs, applications, placements
- Approve/reject student and company registrations
- Analytics charts: top skills, departments, jobs per company
- View all jobs and applications

### Student Features
- Profile with skills, CGPA, resume, bio
- AI-powered job matching with % score
- Browse and apply for jobs
- Track application status
- Coding practice (practice & scored modes)
- Real-time chat with companies

### Company Features
- Company profile management
- Post jobs with required skills, min CGPA, min coding score
- View all applicants with status management
- AI-filtered eligible students list
- Real-time chat with students

### AI Skill Matching
The algorithm computes:
```
matchPercent = (matched skills / required skills) × 100
eligible = matchPercent ≥ 50 AND cgpa ≥ minCGPA AND codingScore ≥ minScore
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register-student | Student registration |
| POST | /api/auth/register-company | Company registration |
| POST | /api/auth/login | Login (all roles) |
| GET | /api/students/me | Get student profile |
| PUT | /api/students/me | Update profile + skills |
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

## Database Schema

**Tables:** users, students, companies, jobs, skills, student_skills, job_skills, applications, coding_problems, coding_results, messages

---

## Windows Quick Start

Run `setup.bat` for automated dependency installation.
