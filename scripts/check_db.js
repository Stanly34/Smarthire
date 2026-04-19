require('dotenv').config();
const db = require('../db');
const { DEMO_COMPANIES, DEMO_STUDENTS } = require('./lib/demoCredentialsData');

const requiredTables = [
  'users',
  'students',
  'companies',
  'jobs',
  'skills',
  'student_skills',
  'job_skills',
  'applications',
  'coding_problems',
  'coding_results',
  'coding_progress',
  'messages',
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add the Supabase transaction pooler URI first.');
  }

  const tableResult = await db.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = ANY($1::text[])
     ORDER BY table_name`,
    [requiredTables]
  );

  const foundTables = new Set(tableResult.rows.map(row => row.table_name));
  const missingTables = requiredTables.filter(table => !foundTables.has(table));

  const checks = [];
  if (missingTables.length === 0) {
    const seededStudentEmails = DEMO_STUDENTS.map(student => student.email);
    const seededCompanyEmails = DEMO_COMPANIES.map(company => company.email);

    const [
      adminResult,
      skillsResult,
      problemsResult,
      languageResult,
      totalStudentsResult,
      totalCompaniesResult,
      seededStudentsResult,
      seededCompaniesResult,
      keyStudentResult,
      keyCompanyResult,
    ] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS count FROM users WHERE email = 'admin@smarthire.com'"),
      db.query('SELECT COUNT(*)::int AS count FROM skills'),
      db.query('SELECT COUNT(*)::int AS count FROM coding_problems WHERE COALESCE(is_active, TRUE) = TRUE'),
      db.query('SELECT COUNT(DISTINCT language)::int AS count FROM coding_problems WHERE COALESCE(is_active, TRUE) = TRUE AND language IS NOT NULL'),
      db.query('SELECT COUNT(*)::int AS count FROM students'),
      db.query('SELECT COUNT(*)::int AS count FROM companies'),
      db.query(
        `SELECT COUNT(*)::int AS count
         FROM students s
         JOIN users u ON u.id = s.user_id
         WHERE u.email = ANY($1::text[])`,
        [seededStudentEmails]
      ),
      db.query(
        `SELECT COUNT(*)::int AS count
         FROM companies c
         JOIN users u ON u.id = c.user_id
         WHERE u.email = ANY($1::text[])`,
        [seededCompanyEmails]
      ),
      db.query("SELECT COUNT(*)::int AS count FROM users WHERE email = 'arjun.sharma@student.com' AND role = 'student'"),
      db.query("SELECT COUNT(*)::int AS count FROM users WHERE email = 'infosys@hire.com' AND role = 'company'"),
    ]);

    checks.push({
      label: 'default admin',
      passed: adminResult.rows[0].count > 0,
      detail: `${adminResult.rows[0].count} row(s)`,
    });
    checks.push({
      label: 'skills',
      passed: skillsResult.rows[0].count > 0,
      detail: `${skillsResult.rows[0].count} row(s)`,
    });
    checks.push({
      label: 'coding problems',
      passed: problemsResult.rows[0].count === 100,
      detail: `${problemsResult.rows[0].count} row(s)`,
    });
    checks.push({
      label: 'coding languages',
      passed: languageResult.rows[0].count === 10,
      detail: `${languageResult.rows[0].count} distinct language(s)`,
    });
    checks.push({
      label: 'total students',
      passed: totalStudentsResult.rows[0].count >= DEMO_STUDENTS.length,
      detail: `${totalStudentsResult.rows[0].count} row(s)`,
    });
    checks.push({
      label: 'total companies',
      passed: totalCompaniesResult.rows[0].count >= DEMO_COMPANIES.length,
      detail: `${totalCompaniesResult.rows[0].count} row(s)`,
    });
    checks.push({
      label: 'seeded students',
      passed: seededStudentsResult.rows[0].count === DEMO_STUDENTS.length,
      detail: `${seededStudentsResult.rows[0].count}/${DEMO_STUDENTS.length} seeded student account(s)`,
    });
    checks.push({
      label: 'seeded companies',
      passed: seededCompaniesResult.rows[0].count === DEMO_COMPANIES.length,
      detail: `${seededCompaniesResult.rows[0].count}/${DEMO_COMPANIES.length} seeded company account(s)`,
    });
    checks.push({
      label: 'key seeded student',
      passed: keyStudentResult.rows[0].count > 0,
      detail: `${keyStudentResult.rows[0].count} row(s) for arjun.sharma@student.com`,
    });
    checks.push({
      label: 'key seeded company',
      passed: keyCompanyResult.rows[0].count > 0,
      detail: `${keyCompanyResult.rows[0].count} row(s) for infosys@hire.com`,
    });
  }

  console.log('SmartHire database check');
  console.log(`Connected using SSL: ${db.pool.options.ssl ? 'yes' : 'no'}`);
  console.log(`Tables found: ${foundTables.size}/${requiredTables.length}`);

  if (missingTables.length > 0) {
    console.error(`Missing tables: ${missingTables.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  for (const check of checks) {
    console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.label}: ${check.detail}`);
    if (!check.passed) process.exitCode = 1;
  }
}

main()
  .catch(err => {
    console.error('Database check failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
