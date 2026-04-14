require('dotenv').config();
const db = require('../db');

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
    const [adminResult, skillsResult, problemsResult] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS count FROM users WHERE email = 'admin@smarthire.com'"),
      db.query('SELECT COUNT(*)::int AS count FROM skills'),
      db.query('SELECT COUNT(*)::int AS count FROM coding_problems'),
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
      passed: problemsResult.rows[0].count > 0,
      detail: `${problemsResult.rows[0].count} row(s)`,
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
