/**
 * Seed script: 20 demo students, 10 demo companies, and the coding practice catalog
 * Run: node scripts/seed_demo.js
 */
const bcrypt = require('bcrypt');
const db = require('../db');
const { syncCodingProblems } = require('./lib/syncCodingProblems');

const PASS_HASH = bcrypt.hashSync('demo123', 10);

const students = [
  { email: 'arjun.sharma@student.com', full_name: 'Arjun Sharma', department: 'Computer Science', year: 3, cgpa: 8.9, coding_score: 82, skills: [1, 6, 7, 10, 34] },
  { email: 'priya.nair@student.com', full_name: 'Priya Nair', department: 'Information Technology', year: 4, cgpa: 9.2, coding_score: 91, skills: [2, 9, 24, 8, 34] },
  { email: 'rahul.verma@student.com', full_name: 'Rahul Verma', department: 'Computer Science', year: 3, cgpa: 7.5, coding_score: 70, skills: [3, 27, 8, 10, 34] },
  { email: 'sneha.patel@student.com', full_name: 'Sneha Patel', department: 'Electronics', year: 4, cgpa: 8.1, coding_score: 65, skills: [1, 30, 6, 38, 37] },
  { email: 'karthik.r@student.com', full_name: 'Karthik R', department: 'Computer Science', year: 2, cgpa: 8.7, coding_score: 88, skills: [2, 9, 24, 42, 10] },
  { email: 'divya.menon@student.com', full_name: 'Divya Menon', department: 'Information Technology', year: 4, cgpa: 9.0, coding_score: 78, skills: [1, 6, 30, 39, 36] },
  { email: 'vikram.singh@student.com', full_name: 'Vikram Singh', department: 'Computer Science', year: 3, cgpa: 7.8, coding_score: 72, skills: [4, 5, 10, 42, 35] },
  { email: 'ananya.kumar@student.com', full_name: 'Ananya Kumar', department: 'Data Science', year: 4, cgpa: 9.4, coding_score: 95, skills: [2, 9, 24, 8, 34] },
  { email: 'rohan.das@student.com', full_name: 'Rohan Das', department: 'Computer Science', year: 3, cgpa: 7.2, coding_score: 60, skills: [1, 7, 19, 22, 39] },
  { email: 'pooja.iyer@student.com', full_name: 'Pooja Iyer', department: 'Information Technology', year: 4, cgpa: 8.5, coding_score: 80, skills: [3, 27, 8, 21, 34] },
  { email: 'aditya.joshi@student.com', full_name: 'Aditya Joshi', department: 'Computer Science', year: 2, cgpa: 8.3, coding_score: 76, skills: [1, 6, 7, 30, 37] },
  { email: 'meera.pillai@student.com', full_name: 'Meera Pillai', department: 'AI & ML', year: 4, cgpa: 9.1, coding_score: 93, skills: [2, 9, 24, 42, 10] },
  { email: 'suresh.babu@student.com', full_name: 'Suresh Babu', department: 'Computer Science', year: 3, cgpa: 7.0, coding_score: 55, skills: [3, 8, 10, 34, 35] },
  { email: 'lakshmi.n@student.com', full_name: 'Lakshmi N', department: 'Information Technology', year: 4, cgpa: 8.8, coding_score: 85, skills: [1, 6, 29, 38, 36] },
  { email: 'nikhil.gupta@student.com', full_name: 'Nikhil Gupta', department: 'Computer Science', year: 3, cgpa: 8.0, coding_score: 74, skills: [31, 32, 33, 35, 34] },
  { email: 'kavya.reddy@student.com', full_name: 'Kavya Reddy', department: 'Data Science', year: 4, cgpa: 9.3, coding_score: 90, skills: [2, 9, 24, 8, 40] },
  { email: 'amit.chauhan@student.com', full_name: 'Amit Chauhan', department: 'Computer Science', year: 2, cgpa: 7.6, coding_score: 68, skills: [1, 7, 19, 39, 34] },
  { email: 'shreya.bose@student.com', full_name: 'Shreya Bose', department: 'Information Technology', year: 4, cgpa: 8.6, coding_score: 83, skills: [3, 27, 21, 8, 39] },
  { email: 'pranav.more@student.com', full_name: 'Pranav More', department: 'Computer Science', year: 3, cgpa: 7.9, coding_score: 71, skills: [4, 5, 10, 42, 43] },
  { email: 'ishaan.kapoor@student.com', full_name: 'Ishaan Kapoor', department: 'Computer Science', year: 4, cgpa: 8.4, coding_score: 79, skills: [1, 6, 30, 28, 38] },
];

const companies = [
  {
    email: 'infosys@hire.com',
    password: 'company123',
    company_name: 'Infosys',
    industry: 'IT Services',
    location: 'Bengaluru',
    contact_person: 'Ravi Anand',
    phone: '9800001111',
    jobs: [
      { title: 'Systems Engineer', description: 'Design and implement scalable systems.', location: 'Bengaluru', salary_range: '4-7 LPA', min_cgpa: 6.5, min_coding_score: 55, skills: [3, 8, 10, 34] },
      { title: 'Java Backend Developer', description: 'Build microservices with Spring Boot.', location: 'Pune', salary_range: '6-10 LPA', min_cgpa: 7.0, min_coding_score: 60, skills: [3, 27, 8, 21] },
    ],
  },
  {
    email: 'tcs@hire.com',
    password: 'company123',
    company_name: 'TCS',
    industry: 'IT Consulting',
    location: 'Mumbai',
    contact_person: 'Anjali Mehta',
    phone: '9800002222',
    jobs: [
      { title: 'Associate Software Engineer', description: 'Full lifecycle software development.', location: 'Hyderabad', salary_range: '3.5-6 LPA', min_cgpa: 6.0, min_coding_score: 50, skills: [1, 3, 8, 34] },
    ],
  },
  {
    email: 'wipro@hire.com',
    password: 'company123',
    company_name: 'Wipro',
    industry: 'IT Services',
    location: 'Hyderabad',
    contact_person: 'Sunil Rao',
    phone: '9800003333',
    jobs: [
      { title: 'Frontend Developer', description: 'Build user interfaces using React.', location: 'Chennai', salary_range: '5-9 LPA', min_cgpa: 6.5, min_coding_score: 60, skills: [1, 6, 30, 36, 37] },
    ],
  },
  {
    email: 'google@hire.com',
    password: 'company123',
    company_name: 'Google India',
    industry: 'Technology',
    location: 'Bengaluru',
    contact_person: 'Preethi S',
    phone: '9800004444',
    jobs: [
      { title: 'Software Engineer III', description: 'Work on large-scale distributed systems.', location: 'Bengaluru', salary_range: '25-45 LPA', min_cgpa: 8.5, min_coding_score: 90, skills: [1, 2, 10, 42, 43] },
      { title: 'ML Engineer', description: 'Build and deploy ML models at scale.', location: 'Bengaluru', salary_range: '30-50 LPA', min_cgpa: 8.5, min_coding_score: 88, skills: [2, 9, 24, 42, 10] },
    ],
  },
  {
    email: 'amazon@hire.com',
    password: 'company123',
    company_name: 'Amazon Development Center',
    industry: 'E-Commerce / Cloud',
    location: 'Hyderabad',
    contact_person: 'Deepak Nair',
    phone: '9800005555',
    jobs: [
      { title: 'SDE-1 (Backend)', description: 'Build Amazon services in Java/Python.', location: 'Hyderabad', salary_range: '20-35 LPA', min_cgpa: 8.0, min_coding_score: 85, skills: [1, 2, 3, 10, 42] },
    ],
  },
  {
    email: 'flipkart@hire.com',
    password: 'company123',
    company_name: 'Flipkart',
    industry: 'E-Commerce',
    location: 'Bengaluru',
    contact_person: 'Anand Krishnan',
    phone: '9800006666',
    jobs: [
      { title: 'Product Engineer', description: 'Own and build product features end-to-end.', location: 'Bengaluru', salary_range: '18-28 LPA', min_cgpa: 7.5, min_coding_score: 80, skills: [1, 7, 8, 19, 39] },
      { title: 'Data Engineer', description: 'Build data pipelines and analytics.', location: 'Bengaluru', salary_range: '15-25 LPA', min_cgpa: 7.5, min_coding_score: 75, skills: [2, 8, 24, 21, 34] },
    ],
  },
  {
    email: 'zomato@hire.com',
    password: 'company123',
    company_name: 'Zomato',
    industry: 'Food-Tech',
    location: 'Gurugram',
    contact_person: 'Nitin Sharma',
    phone: '9800007777',
    jobs: [
      { title: 'Backend Engineer', description: 'Scale Zomato ordering infrastructure.', location: 'Gurugram', salary_range: '12-20 LPA', min_cgpa: 7.0, min_coding_score: 70, skills: [2, 7, 19, 8, 39] },
    ],
  },
  {
    email: 'swiggy@hire.com',
    password: 'company123',
    company_name: 'Swiggy',
    industry: 'Food-Tech',
    location: 'Bengaluru',
    contact_person: 'Rahul Jain',
    phone: '9800008888',
    jobs: [
      { title: 'Full Stack Engineer', description: 'Build consumer-facing features.', location: 'Bengaluru', salary_range: '14-22 LPA', min_cgpa: 7.0, min_coding_score: 72, skills: [1, 6, 7, 30, 39] },
    ],
  },
  {
    email: 'razorpay@hire.com',
    password: 'company123',
    company_name: 'Razorpay',
    industry: 'FinTech',
    location: 'Bengaluru',
    contact_person: 'Vivek Kumar',
    phone: '9800009999',
    jobs: [
      { title: 'Software Engineer - Payments', description: 'Build reliable payment systems.', location: 'Bengaluru', salary_range: '16-26 LPA', min_cgpa: 7.5, min_coding_score: 78, skills: [1, 7, 8, 19, 43] },
    ],
  },
  {
    email: 'byju@hire.com',
    password: 'company123',
    company_name: "BYJU'S",
    industry: 'EdTech',
    location: 'Bengaluru',
    contact_person: 'Sanjana Pillai',
    phone: '9800000000',
    jobs: [
      { title: 'React Developer', description: 'Build interactive learning UI.', location: 'Bengaluru', salary_range: '8-14 LPA', min_cgpa: 6.5, min_coding_score: 60, skills: [1, 6, 30, 38, 36] },
    ],
  },
];

async function seed() {
  console.log('Starting seed...\n');

  console.log('Inserting 20 students...');
  for (const student of students) {
    try {
      const existing = await db.query('SELECT id FROM users WHERE email=$1', [student.email]);
      if (existing.rows.length > 0) {
        console.log(`  SKIP (exists): ${student.email}`);
        continue;
      }

      const userResult = await db.query(
        'INSERT INTO users (email, password, role, is_approved) VALUES ($1,$2,$3,$4) RETURNING id',
        [student.email, PASS_HASH, 'student', true]
      );
      const userId = userResult.rows[0].id;

      const studentResult = await db.query(
        `INSERT INTO students (user_id, full_name, department, year_of_study, cgpa, coding_score, bio, linkedin_url, github_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [
          userId,
          student.full_name,
          student.department,
          student.year,
          student.cgpa,
          student.coding_score,
          `Passionate ${student.department} student with ${student.year} years of experience in software development.`,
          `https://linkedin.com/in/${student.full_name.toLowerCase().replace(/ /g, '-')}`,
          `https://github.com/${student.full_name.toLowerCase().replace(/ /g, '')}`,
        ]
      );
      const studentId = studentResult.rows[0].id;

      for (const skillId of student.skills) {
        await db
          .query('INSERT INTO student_skills (student_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [studentId, skillId])
          .catch(() => {});
      }

      console.log(`  OK ${student.full_name}`);
    } catch (error) {
      console.error(`  FAIL ${student.email}: ${error.message}`);
    }
  }

  console.log('\nInserting 10 companies...');
  for (const company of companies) {
    try {
      const existing = await db.query('SELECT id FROM users WHERE email=$1', [company.email]);
      let companyId;

      if (existing.rows.length > 0) {
        console.log(`  SKIP user (exists): ${company.email}`);
        const companyRow = await db.query('SELECT id FROM companies WHERE user_id=$1', [existing.rows[0].id]);
        if (!companyRow.rows.length) continue;
        companyId = companyRow.rows[0].id;
      } else {
        const hash = bcrypt.hashSync(company.password, 10);
        const userResult = await db.query(
          'INSERT INTO users (email, password, role, is_approved) VALUES ($1,$2,$3,$4) RETURNING id',
          [company.email, hash, 'company', true]
        );
        const userId = userResult.rows[0].id;

        const companyResult = await db.query(
          `INSERT INTO companies (user_id, company_name, industry, location, contact_person, phone)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
          [userId, company.company_name, company.industry, company.location, company.contact_person, company.phone]
        );
        companyId = companyResult.rows[0].id;
        console.log(`  OK ${company.company_name}`);
      }

      for (const job of company.jobs) {
        const existingJob = await db.query('SELECT id FROM jobs WHERE company_id=$1 AND title=$2', [companyId, job.title]);
        if (existingJob.rows.length > 0) {
          console.log(`    SKIP job: ${job.title}`);
          continue;
        }

        const jobResult = await db.query(
          `INSERT INTO jobs (company_id, title, description, location, salary_range, min_cgpa, min_coding_score, status, job_type)
           VALUES ($1,$2,$3,$4,$5,$6,$7,'open','full-time') RETURNING id`,
          [companyId, job.title, job.description, job.location, job.salary_range, job.min_cgpa, job.min_coding_score]
        );
        const jobId = jobResult.rows[0].id;

        for (const skillId of job.skills) {
          await db
            .query('INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [jobId, skillId])
            .catch(() => {});
        }

        console.log(`    + Job: ${job.title}`);
      }
    } catch (error) {
      console.error(`  FAIL ${company.company_name}: ${error.message}`);
    }
  }

  console.log('\nSyncing coding practice catalog...');
  try {
    const result = await syncCodingProblems(db, { log: message => console.log(`  ${message}`) });
    console.log(`  Coding problems ready: ${result.total}`);
  } catch (error) {
    console.error(`  FAIL coding practice sync: ${error.message}`);
  }

  console.log('\nSeed complete!');
  process.exit(0);
}

seed().catch(error => {
  console.error('Fatal:', error);
  process.exit(1);
});
