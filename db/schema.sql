-- SmartHire Database Schema

-- Users table (base for all user types)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  year_of_study INTEGER,
  cgpa DECIMAL(4,2),
  resume_url VARCHAR(500),
  coding_score INTEGER DEFAULT 0,
  bio TEXT,
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  logo_url VARCHAR(500),
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Skills table (master list)
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Student skills (many-to-many)
CREATE TABLE IF NOT EXISTS student_skills (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(student_id, skill_id)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  salary_range VARCHAR(100),
  job_type VARCHAR(50) DEFAULT 'full-time',
  min_cgpa DECIMAL(4,2) DEFAULT 0,
  min_coding_score INTEGER DEFAULT 0,
  interview_date DATE,
  deadline DATE,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job required skills (many-to-many)
CREATE TABLE IF NOT EXISTS job_skills (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(job_id, skill_id)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'selected')),
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, job_id)
);

-- Coding problems table
CREATE TABLE IF NOT EXISTS coding_problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  language VARCHAR(50),
  sample_input TEXT,
  sample_output TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coding results table
CREATE TABLE IF NOT EXISTS coding_results (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES coding_problems(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  mode VARCHAR(20) CHECK (mode IN ('practice', 'score')),
  submitted_code TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Messages table (real-time chat)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Safe migrations for existing databases (adds missing columns if they don't exist)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
ALTER TABLE students ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500);
ALTER TABLE students ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type VARCHAR(50) DEFAULT 'full-time';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS min_cgpa DECIMAL(4,2) DEFAULT 0;
ALTER TABLE coding_problems ADD COLUMN IF NOT EXISTS language VARCHAR(50);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
CREATE UNIQUE INDEX IF NOT EXISTS coding_problems_title_language_idx ON coding_problems (title, language);

-- Seed default admin
INSERT INTO users (email, password, role, is_approved)
VALUES ('admin@smarthire.com', '$2b$10$zQGC.v.jgmk79SjSFp00teQG5JK.DJZ4fQkiCFcCFwEcKu.Sybho2', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Seed common skills
INSERT INTO skills (name) VALUES
  ('Python'), ('JavaScript'), ('Java'), ('C++'), ('C'),
  ('React'), ('Node.js'), ('Express'), ('SQL'), ('PostgreSQL'),
  ('MongoDB'), ('Machine Learning'), ('Data Science'), ('Django'),
  ('Flask'), ('Spring Boot'), ('Angular'), ('Vue.js'), ('TypeScript'),
  ('Docker'), ('Kubernetes'), ('AWS'), ('Git'), ('Linux'),
  ('HTML'), ('CSS'), ('TailwindCSS'), ('REST API'), ('GraphQL'),
  ('Data Structures'), ('Algorithms'), ('System Design'), ('PHP'), ('Ruby')
ON CONFLICT (name) DO NOTHING;

-- Seed the full coding practice catalog with:
--   node scripts/seed_coding_practice.js
