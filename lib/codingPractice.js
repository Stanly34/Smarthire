const { LANGUAGE_ORDER } = require('../db/codingPracticeSeed');

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];

function getLanguageSortIndex(language) {
  const index = LANGUAGE_ORDER.indexOf(language);
  return index === -1 ? 999 : index;
}

function sortProgressRows(rows) {
  return [...rows].sort((left, right) => {
    const leftLevel = LEVEL_ORDER.indexOf(left.language_level);
    const rightLevel = LEVEL_ORDER.indexOf(right.language_level);
    const normalizedLeftLevel = leftLevel === -1 ? 999 : leftLevel;
    const normalizedRightLevel = rightLevel === -1 ? 999 : rightLevel;

    if (normalizedLeftLevel !== normalizedRightLevel) {
      return normalizedLeftLevel - normalizedRightLevel;
    }

    return getLanguageSortIndex(left.language) - getLanguageSortIndex(right.language);
  });
}

async function ensureCodingProgressForStudent(client, studentId) {
  await client.query(
    `INSERT INTO coding_progress (student_id, language, current_task_number, completed_count, created_at, updated_at)
     SELECT $1, languages.language, 1, 0, NOW(), NOW()
     FROM (
       SELECT DISTINCT language
       FROM coding_problems
       WHERE COALESCE(is_active, TRUE) = TRUE
     ) languages
     ON CONFLICT (student_id, language) DO NOTHING`,
    [studentId]
  );
}

async function ensureCodingProgressForAllStudents(client) {
  await client.query(
    `INSERT INTO coding_progress (student_id, language, current_task_number, completed_count, created_at, updated_at)
     SELECT students.id, languages.language, 1, 0, NOW(), NOW()
     FROM students
     CROSS JOIN (
       SELECT DISTINCT language
       FROM coding_problems
       WHERE COALESCE(is_active, TRUE) = TRUE
     ) languages
     ON CONFLICT (student_id, language) DO NOTHING`
  );
}

async function getStudentIdForUser(client, userId) {
  const result = await client.query('SELECT id FROM students WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

async function getLanguageProgress(client, studentId) {
  await ensureCodingProgressForStudent(client, studentId);

  const result = await client.query(
    `SELECT
       progress.language,
       totals.language_level,
       progress.current_task_number,
       progress.completed_count,
       totals.total_tasks,
       (progress.completed_count >= totals.total_tasks) AS is_completed,
       current_problem.id AS current_problem_id,
       current_problem.title AS current_problem_title,
       current_problem.task_number AS current_problem_task_number
     FROM coding_progress progress
     JOIN (
       SELECT language, MAX(language_level) AS language_level, COUNT(*)::int AS total_tasks
       FROM coding_problems
       WHERE COALESCE(is_active, TRUE) = TRUE
       GROUP BY language
     ) totals ON totals.language = progress.language
     LEFT JOIN coding_problems current_problem
       ON current_problem.language = progress.language
      AND current_problem.task_number = progress.current_task_number
      AND COALESCE(current_problem.is_active, TRUE) = TRUE
     WHERE progress.student_id = $1`,
    [studentId]
  );

  return sortProgressRows(result.rows).map(row => ({
    language: row.language,
    language_level: row.language_level,
    current_task_number: row.current_task_number,
    completed_count: row.completed_count,
    total_tasks: row.total_tasks,
    is_completed: row.is_completed,
    current_problem: row.current_problem_id
      ? {
          id: row.current_problem_id,
          title: row.current_problem_title,
          task_number: row.current_problem_task_number,
        }
      : null,
  }));
}

async function getCurrentLanguageState(client, studentId, language) {
  await ensureCodingProgressForStudent(client, studentId);

  const progressResult = await client.query(
    `SELECT
       progress.language,
       progress.current_task_number,
       progress.completed_count,
       totals.language_level,
       totals.total_tasks
     FROM coding_progress progress
     JOIN (
       SELECT language, MAX(language_level) AS language_level, COUNT(*)::int AS total_tasks
       FROM coding_problems
       WHERE COALESCE(is_active, TRUE) = TRUE
       GROUP BY language
     ) totals ON totals.language = progress.language
     WHERE progress.student_id = $1 AND progress.language = $2`,
    [studentId, language]
  );

  const progress = progressResult.rows[0];
  if (!progress) {
    return null;
  }

  const isCompleted = progress.completed_count >= progress.total_tasks;
  if (isCompleted) {
    return {
      progress: {
        language: progress.language,
        language_level: progress.language_level,
        current_task_number: progress.current_task_number,
        completed_count: progress.completed_count,
        total_tasks: progress.total_tasks,
        is_completed: true,
      },
      currentProblem: null,
    };
  }

  const problemResult = await client.query(
    `SELECT
       id, title, description, difficulty, language, language_level,
       task_number, sample_input, sample_output, starter_code, test_cases
     FROM coding_problems
     WHERE language = $1
       AND task_number = $2
       AND COALESCE(is_active, TRUE) = TRUE`,
    [language, progress.current_task_number]
  );

  return {
    progress: {
      language: progress.language,
      language_level: progress.language_level,
      current_task_number: progress.current_task_number,
      completed_count: progress.completed_count,
      total_tasks: progress.total_tasks,
      is_completed: false,
    },
    currentProblem: problemResult.rows[0] || null,
  };
}

module.exports = {
  LANGUAGE_ORDER,
  ensureCodingProgressForAllStudents,
  ensureCodingProgressForStudent,
  getCurrentLanguageState,
  getLanguageProgress,
  getStudentIdForUser,
};
