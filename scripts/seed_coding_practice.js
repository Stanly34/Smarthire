require('dotenv').config();
const db = require('../db');
const { syncCodingProblems } = require('./lib/syncCodingProblems');

async function main() {
  await db.query('BEGIN');
  try {
    const result = await syncCodingProblems(db, { log: message => console.log(message) });
    await db.query('COMMIT');

    console.log('Coding practice seed complete.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

main()
  .catch(err => {
    console.error('Coding practice seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
