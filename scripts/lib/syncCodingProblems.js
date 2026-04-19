const { CODING_PROBLEMS, LANGUAGE_ORDER } = require('../../db/codingPracticeSeed');
const { ensureCodingProgressForAllStudents } = require('../../lib/codingPractice');

function normalizeText(value) {
  return (value || '').trim().toLowerCase();
}

function makeProblemKey(language, taskNumber) {
  return `${normalizeText(language)}::${taskNumber}`;
}

function formatBreakdownRows(rows) {
  return rows.reduce((acc, row) => {
    acc[row.language] = acc[row.language] || { level: row.language_level, tasks: 0 };
    acc[row.language].level = row.language_level;
    acc[row.language].tasks = row.count;
    return acc;
  }, {});
}

async function syncCodingProblems(db, options = {}) {
  const log = options.log || (() => {});
  const activeTargetKeys = new Set(CODING_PROBLEMS.map(problem => makeProblemKey(problem.language, problem.task_number)));

  await db.query('DROP INDEX IF EXISTS coding_problems_title_language_idx');
  await db.query('DROP INDEX IF EXISTS coding_problems_active_language_task_idx');
  await db.query('DROP INDEX IF EXISTS coding_problems_active_title_language_idx');
  const existingResult = await db.query(
    `SELECT
       id,
       title,
       description,
       difficulty,
       language,
       task_number,
       language_level,
       starter_code,
       sample_input,
       sample_output,
       test_cases,
       COALESCE(is_active, TRUE) AS is_active
     FROM coding_problems
     WHERE COALESCE(is_active, TRUE) = TRUE
     ORDER BY id`
  );

  const existingByKey = new Map();
  const archiveIds = [];
  let inserted = 0;
  let updated = 0;

  for (const row of existingResult.rows) {
    const key = row.task_number ? makeProblemKey(row.language, row.task_number) : null;

    if (!key || !activeTargetKeys.has(key) || existingByKey.has(key)) {
      archiveIds.push(row.id);
      continue;
    }

    existingByKey.set(key, row);
  }

  for (const problem of CODING_PROBLEMS) {
    const key = makeProblemKey(problem.language, problem.task_number);
    const existing = existingByKey.get(key);
    const params = [
      problem.title,
      problem.description,
      problem.difficulty,
      problem.language,
      problem.task_number,
      problem.language_level,
      problem.starter_code,
      problem.sample_input,
      problem.sample_output,
      JSON.stringify(problem.test_cases),
    ];

    if (existing) {
      await db.query(
        `UPDATE coding_problems
         SET title = $1,
             description = $2,
             difficulty = $3,
             language = $4,
             task_number = $5,
             language_level = $6,
             starter_code = $7,
             sample_input = $8,
             sample_output = $9,
             test_cases = $10::jsonb,
             is_active = TRUE
         WHERE id = $11`,
        [...params, existing.id]
      );
      updated += 1;
    } else {
      await db.query(
        `INSERT INTO coding_problems
           (title, description, difficulty, language, task_number, language_level, starter_code, sample_input, sample_output, test_cases, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,TRUE)`,
        params
      );
      inserted += 1;
    }
  }

  if (archiveIds.length > 0) {
    await db.query('UPDATE coding_problems SET is_active = FALSE WHERE id = ANY($1::int[])', [archiveIds]);
  }

  await db.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS coding_problems_active_language_task_idx
     ON coding_problems (language, task_number)
     WHERE is_active = TRUE`
  );
  await db.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS coding_problems_active_title_language_idx
     ON coding_problems (title, language)
     WHERE is_active = TRUE`
  );

  await ensureCodingProgressForAllStudents(db);

  const summaryResult = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(DISTINCT language)::int AS languages
     FROM coding_problems
     WHERE is_active = TRUE`
  );

  const breakdownResult = await db.query(
    `SELECT language, language_level, COUNT(*)::int AS count
     FROM coding_problems
     WHERE is_active = TRUE
     GROUP BY language, language_level`
  );

  const progressResult = await db.query(
    `SELECT COUNT(*)::int AS count
     FROM coding_progress`
  );

  const summary = summaryResult.rows[0];
  const breakdown = formatBreakdownRows(breakdownResult.rows);

  log(`Languages synced: ${LANGUAGE_ORDER.length}`);
  log(`Active problems total: ${summary.total}`);
  log(`Inserted: ${inserted}, updated: ${updated}, archived: ${archiveIds.length}`);
  log(`Progress rows: ${progressResult.rows[0].count}`);

  return {
    inserted,
    updated,
    archived: archiveIds.length,
    total: summary.total,
    languages: summary.languages,
    progressRows: progressResult.rows[0].count,
    breakdown,
  };
}

module.exports = {
  CODING_PROBLEMS,
  syncCodingProblems,
};
