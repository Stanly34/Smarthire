const bcrypt = require('bcrypt');
const db = require('../db');

const DEMO_USERS = [
  {
    email: 'admin@smarthire.com',
    password: 'admin123',
    role: 'admin',
    isApproved: true,
  },
  {
    email: 'arjun.sharma@student.com',
    password: 'demo123',
    role: 'student',
    isApproved: true,
    profile: {
      full_name: 'Arjun Sharma',
      phone: '9876543210',
      department: 'Computer Science',
      year_of_study: 3,
      cgpa: 8.9,
      coding_score: 82,
      bio: 'Demo student account for SmartHire.',
      linkedin_url: 'https://linkedin.com/in/arjun-sharma',
      github_url: 'https://github.com/arjunsharma',
      resume_url: null,
    },
  },
  {
    email: 'infosys@hire.com',
    password: 'company123',
    role: 'company',
    isApproved: true,
    profile: {
      company_name: 'Infosys',
      industry: 'IT Services',
      website: 'https://www.infosys.com',
      description: 'Demo company account for SmartHire.',
      location: 'Bengaluru',
      logo_url: null,
      contact_person: 'Ravi Anand',
      phone: '9800001111',
    },
  },
];

async function upsertUser(client, user) {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const existing = await client.query(
    'SELECT id FROM users WHERE email = $1',
    [user.email]
  );

  if (existing.rows.length > 0) {
    const userId = existing.rows[0].id;
    await client.query(
      `UPDATE users
       SET password = $1, role = $2, is_approved = $3
       WHERE id = $4`,
      [passwordHash, user.role, user.isApproved, userId]
    );
    return userId;
  }

  const inserted = await client.query(
    `INSERT INTO users (email, password, role, is_approved)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [user.email, passwordHash, user.role, user.isApproved]
  );

  return inserted.rows[0].id;
}

async function upsertStudentProfile(client, userId, profile) {
  const existing = await client.query(
    'SELECT id FROM students WHERE user_id = $1',
    [userId]
  );

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE students
       SET full_name = $1, phone = $2, department = $3, year_of_study = $4,
           cgpa = $5, coding_score = $6, bio = $7, linkedin_url = $8,
           github_url = $9, resume_url = $10
       WHERE user_id = $11`,
      [
        profile.full_name,
        profile.phone,
        profile.department,
        profile.year_of_study,
        profile.cgpa,
        profile.coding_score,
        profile.bio,
        profile.linkedin_url,
        profile.github_url,
        profile.resume_url,
        userId,
      ]
    );
    return;
  }

  await client.query(
    `INSERT INTO students
       (user_id, full_name, phone, department, year_of_study, cgpa,
        coding_score, bio, linkedin_url, github_url, resume_url)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      userId,
      profile.full_name,
      profile.phone,
      profile.department,
      profile.year_of_study,
      profile.cgpa,
      profile.coding_score,
      profile.bio,
      profile.linkedin_url,
      profile.github_url,
      profile.resume_url,
    ]
  );
}

async function upsertCompanyProfile(client, userId, profile) {
  const existing = await client.query(
    'SELECT id FROM companies WHERE user_id = $1',
    [userId]
  );

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE companies
       SET company_name = $1, industry = $2, website = $3, description = $4,
           location = $5, logo_url = $6, contact_person = $7, phone = $8
       WHERE user_id = $9`,
      [
        profile.company_name,
        profile.industry,
        profile.website,
        profile.description,
        profile.location,
        profile.logo_url,
        profile.contact_person,
        profile.phone,
        userId,
      ]
    );
    return;
  }

  await client.query(
    `INSERT INTO companies
       (user_id, company_name, industry, website, description, location,
        logo_url, contact_person, phone)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      userId,
      profile.company_name,
      profile.industry,
      profile.website,
      profile.description,
      profile.location,
      profile.logo_url,
      profile.contact_person,
      profile.phone,
    ]
  );
}

async function seedDemoCredentials() {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    for (const user of DEMO_USERS) {
      const userId = await upsertUser(client, user);

      if (user.role === 'student') {
        await upsertStudentProfile(client, userId, user.profile);
      }

      if (user.role === 'company') {
        await upsertCompanyProfile(client, userId, user.profile);
      }
    }

    await client.query('COMMIT');
    console.log('Demo credentials seeded successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed demo credentials:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.pool.end();
  }
}

seedDemoCredentials();
