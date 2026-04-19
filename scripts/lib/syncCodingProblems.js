const { CODING_LANGUAGES, CODING_PROBLEMS } = require('../../db/codingPracticeSeed');

function normalizeText(value) {
  return (value || '').trim().toLowerCase();
}

function makeProblemKey(title, language) {
  return `${normalizeText(title)}::${normalizeText(language)}`;
}

function formatBreakdownRows(rows) {
  return rows.reduce((acc, row) => {
    acc[row.language] = acc[row.language] || { beginner: 0, intermediate: 0, advanced: 0 };
    acc[row.language][row.difficulty] = row.count;
    return acc;
  }, {});
}

async function syncCodingProblems(db, options = {}) {
  const log = options.log || (() => {});
  const targetProblems = CODING_PROBLEMS;
  const targetByKey = new Map(targetProblems.map(problem => [makeProblemKey(problem.title, problem.language), problem]));

  const existingResult = await db.query(
    `SELECT id, title, description, difficulty, language, sample_input, sample_output
     FROM coding_problems
     ORDER BY id`
  );

  const keepers = new Map();
  const idsToDelete = [];
  let inserted = 0;
  let updated = 0;
  let reassigned = 0;

  for (const row of existingResult.rows) {
    const key = makeProblemKey(row.title, row.language);

    if (!targetByKey.has(key)) {
      idsToDelete.push(row.id);
      continue;
    }

    if (!keepers.has(key)) {
      keepers.set(key, row);
      continue;
    }

    const keeper = keepers.get(key);
    await db.query('UPDATE coding_results SET problem_id=$1 WHERE problem_id=$2', [keeper.id, row.id]);
    idsToDelete.push(row.id);
    reassigned += 1;
  }

  for (const [key, problem] of targetByKey.entries()) {
    const existing = keepers.get(key);

    if (existing) {
      await db.query(
        `UPDATE coding_problems
         SET title=$1, description=$2, difficulty=$3, language=$4, sample_input=$5, sample_output=$6
         WHERE id=$7`,
        [
          problem.title,
          problem.description,
          problem.difficulty,
          problem.language,
          problem.sample_input,
          problem.sample_output,
          existing.id,
        ]
      );
      updated += 1;
      continue;
    }

    await db.query(
      `INSERT INTO coding_problems (title, description, difficulty, language, sample_input, sample_output)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        problem.title,
        problem.description,
        problem.difficulty,
        problem.language,
        problem.sample_input,
        problem.sample_output,
      ]
    );
    inserted += 1;
  }

  if (idsToDelete.length > 0) {
    await db.query('DELETE FROM coding_problems WHERE id = ANY($1::int[])', [idsToDelete]);
  }

  await db.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS coding_problems_title_language_idx ON coding_problems (title, language)'
  );

  const summaryResult = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(DISTINCT language)::int AS languages
     FROM coding_problems`
  );
  const breakdownResult = await db.query(
    `SELECT language, difficulty, COUNT(*)::int AS count
     FROM coding_problems
     GROUP BY language, difficulty
     ORDER BY
       CASE language
         WHEN 'C++' THEN 1
         WHEN 'Java' THEN 2
         WHEN 'JavaScript' THEN 3
         WHEN 'Python' THEN 4
         WHEN 'C' THEN 5
         WHEN 'C#' THEN 6
         WHEN 'Go' THEN 7
         WHEN 'TypeScript' THEN 8
         WHEN 'PHP' THEN 9
         WHEN 'Rust' THEN 10
         ELSE 999
       END,
       CASE difficulty
         WHEN 'beginner' THEN 1
         WHEN 'intermediate' THEN 2
         WHEN 'advanced' THEN 3
         ELSE 999
       END`
  );

  const summary = summaryResult.rows[0];
  const breakdown = formatBreakdownRows(breakdownResult.rows);

  log(`Languages synced: ${CODING_LANGUAGES.length}`);
  log(`Problems total: ${summary.total}`);
  log(`Inserted: ${inserted}, updated: ${updated}, removed: ${idsToDelete.length}, reassigned results: ${reassigned}`);

  return {
    inserted,
    updated,
    removed: idsToDelete.length,
    reassigned,
    total: summary.total,
    languages: summary.languages,
    breakdown,
  };
}

module.exports = {
  CODING_LANGUAGES,
  CODING_PROBLEMS,
  syncCodingProblems,
};
