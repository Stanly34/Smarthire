const bcrypt = require('bcrypt');
const db = require('../db');
const {
  ADMIN_CREDENTIAL,
  DEMO_COMPANIES,
  DEMO_STUDENTS,
} = require('./lib/demoCredentialsData');

const LEGACY_SKILL_ID_TO_NAME = {
  1: 'JavaScript',
  2: 'Python',
  3: 'Java',
  4: 'C++',
  5: 'C',
  6: 'React',
  7: 'Node.js',
  8: 'SQL',
  9: 'Machine Learning',
  10: 'Data Structures',
  19: 'Express',
  21: 'PostgreSQL',
  22: 'MongoDB',
  24: 'Data Science',
  27: 'Spring Boot',
  28: 'Angular',
  29: 'Vue.js',
  30: 'TypeScript',
  31: 'Docker',
  32: 'Kubernetes',
  33: 'AWS',
  34: 'Git',
  35: 'Linux',
  36: 'HTML',
  37: 'CSS',
  38: 'TailwindCSS',
  39: 'REST API',
  40: 'GraphQL',
  42: 'Algorithms',
  43: 'System Design',
};

function resolveSkillNames(skills) {
  return skills.map((skill) => {
    if (typeof skill === 'string') return skill;

    const resolved = LEGACY_SKILL_ID_TO_NAME[skill];
    if (!resolved) {
      throw new Error(`Unknown demo skill reference: ${skill}`);
    }

    return resolved;
  });
}

async function ensureSkillIds(client, skills) {
  const skillIds = [];

  for (const skillName of resolveSkillNames(skills)) {
    let skillRow = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);

    if (skillRow.rows.length === 0) {
      skillRow = await client.query(
        'INSERT INTO skills (name) VALUES ($1) RETURNING id',
        [skillName]
      );
    }

    skillIds.push(skillRow.rows[0].id);
  }

  return skillIds;
}

async function upsertUser(client, { email, password, role, isApproved = true }) {
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await client.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existing.rows.length > 0) {
    const userId = existing.rows[0].id;
    await client.query(
      `UPDATE users
       SET password = $1, role = $2, is_approved = $3
       WHERE id = $4`,
      [passwordHash, role, isApproved, userId]
    );
    return userId;
  }

  const inserted = await client.query(
    `INSERT INTO users (email, password, role, is_approved)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [email, passwordHash, role, isApproved]
  );

  return inserted.rows[0].id;
}

async function upsertStudentProfile(client, userId, student) {
  const existing = await client.query(
    'SELECT id FROM students WHERE user_id = $1',
    [userId]
  );

  let studentId;
  if (existing.rows.length > 0) {
    studentId = existing.rows[0].id;
    await client.query(
      `UPDATE students
       SET full_name = $1,
           phone = $2,
           department = $3,
           year_of_study = $4,
           cgpa = $5,
           coding_score = $6,
           bio = $7,
           linkedin_url = $8,
           github_url = $9,
           resume_url = $10
       WHERE id = $11`,
      [
        student.full_name,
        student.phone,
        student.department,
        student.year_of_study,
        student.cgpa,
        student.coding_score,
        student.bio,
        student.linkedin_url,
        student.github_url,
        student.resume_url,
        studentId,
      ]
    );
  } else {
    const inserted = await client.query(
      `INSERT INTO students
         (user_id, full_name, phone, department, year_of_study, cgpa, coding_score, bio, linkedin_url, github_url, resume_url)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        userId,
        student.full_name,
        student.phone,
        student.department,
        student.year_of_study,
        student.cgpa,
        student.coding_score,
        student.bio,
        student.linkedin_url,
        student.github_url,
        student.resume_url,
      ]
    );
    studentId = inserted.rows[0].id;
  }

  await client.query('DELETE FROM student_skills WHERE student_id = $1', [studentId]);
  const skillIds = await ensureSkillIds(client, student.skills);

  for (const skillId of skillIds) {
    await client.query(
      'INSERT INTO student_skills (student_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [studentId, skillId]
    );
  }
}

async function upsertCompanyProfile(client, userId, company) {
  const existing = await client.query(
    'SELECT id FROM companies WHERE user_id = $1',
    [userId]
  );

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE companies
       SET company_name = $1,
           industry = $2,
           website = $3,
           description = $4,
           location = $5,
           logo_url = $6,
           contact_person = $7,
           phone = $8
       WHERE user_id = $9`,
      [
        company.company_name,
        company.industry,
        company.website,
        company.description,
        company.location,
        company.logo_url,
        company.contact_person,
        company.phone,
        userId,
      ]
    );
    return;
  }

  await client.query(
    `INSERT INTO companies
       (user_id, company_name, industry, website, description, location, logo_url, contact_person, phone)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      userId,
      company.company_name,
      company.industry,
      company.website,
      company.description,
      company.location,
      company.logo_url,
      company.contact_person,
      company.phone,
    ]
  );
}

async function seedUsers() {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await upsertUser(client, {
      email: ADMIN_CREDENTIAL.email,
      password: ADMIN_CREDENTIAL.password,
      role: ADMIN_CREDENTIAL.role,
      isApproved: true,
    });

    for (const student of DEMO_STUDENTS) {
      const userId = await upsertUser(client, {
        email: student.email,
        password: student.password,
        role: 'student',
        isApproved: true,
      });
      await upsertStudentProfile(client, userId, student);
    }

    for (const company of DEMO_COMPANIES) {
      const userId = await upsertUser(client, {
        email: company.email,
        password: company.password,
        role: 'company',
        isApproved: true,
      });
      await upsertCompanyProfile(client, userId, company);
    }

    await client.query('COMMIT');

    console.log(`Seeded ${DEMO_STUDENTS.length} students and ${DEMO_COMPANIES.length} companies.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed users:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.pool.end();
  }
}

seedUsers();
