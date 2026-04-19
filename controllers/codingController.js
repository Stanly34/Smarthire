const db = require('../db');
const {
  getCurrentLanguageState,
  getLanguageProgress,
  getStudentIdForUser,
} = require('../lib/codingPractice');
const { executeCodeAgainstTests } = require('../services/judge0Runner');

function formatProblem(problem) {
  if (!problem) {
    return null;
  }

  return {
    id: problem.id,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    language: problem.language,
    language_level: problem.language_level,
    task_number: problem.task_number,
    sample_input: problem.sample_input,
    sample_output: problem.sample_output,
  };
}

async function refreshCodingScore(client, studentId) {
  const averageResult = await client.query(
    `SELECT ROUND(AVG(score))::int AS avg_score
     FROM coding_results
     WHERE student_id = $1 AND mode = 'score'`,
    [studentId]
  );

  const averageScore = averageResult.rows[0]?.avg_score || 0;
  await client.query('UPDATE students SET coding_score = $1 WHERE id = $2', [averageScore, studentId]);
}

// GET /api/coding/problems
const getProblems = async (req, res) => {
  try {
    const { difficulty, language } = req.query;
    const params = [];
    let query = `
      SELECT
        id, title, description, difficulty, language, language_level,
        task_number, sample_input, sample_output
      FROM coding_problems
      WHERE COALESCE(is_active, TRUE) = TRUE
    `;

    if (difficulty) {
      params.push(difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    if (language) {
      params.push(language);
      query += ` AND language = $${params.length}`;
    }

    query += ' ORDER BY language, task_number';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('getProblems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/coding/problems/:id
const getProblemById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         id, title, description, difficulty, language, language_level,
         task_number, sample_input, sample_output
       FROM coding_problems
       WHERE id = $1 AND COALESCE(is_active, TRUE) = TRUE`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('getProblemById error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/coding/progress/me
const getMyProgress = async (req, res) => {
  try {
    const studentId = await getStudentIdForUser(db, req.user.id);
    if (!studentId) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const progress = await getLanguageProgress(db, studentId);
    res.json(progress);
  } catch (error) {
    console.error('getMyProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/coding/current?language=Python
const getCurrentProblem = async (req, res) => {
  try {
    const { language } = req.query;
    if (!language) {
      return res.status(400).json({ message: 'language is required' });
    }

    const studentId = await getStudentIdForUser(db, req.user.id);
    if (!studentId) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const state = await getCurrentLanguageState(db, studentId, language);
    if (!state) {
      return res.status(404).json({ message: 'Language not found in coding practice' });
    }

    res.json({
      language: state.progress.language,
      language_level: state.progress.language_level,
      current_task_number: state.progress.current_task_number,
      completed_count: state.progress.completed_count,
      total_tasks: state.progress.total_tasks,
      is_completed: state.progress.is_completed,
      current_problem: formatProblem(state.currentProblem),
    });
  } catch (error) {
    console.error('getCurrentProblem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/coding/submit
const submitCode = async (req, res) => {
  const { problem_id, submitted_code, mode } = req.body;

  if (!problem_id || !submitted_code || !mode) {
    return res.status(400).json({ message: 'problem_id, submitted_code, and mode are required' });
  }

  if (!['practice', 'score'].includes(mode)) {
    return res.status(400).json({ message: 'mode must be practice or score' });
  }

  try {
    const studentId = await getStudentIdForUser(db, req.user.id);
    if (!studentId) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const problemResult = await db.query(
      `SELECT
         id, title, description, difficulty, language, language_level,
         task_number, sample_input, sample_output, starter_code, test_cases
       FROM coding_problems
       WHERE id = $1 AND COALESCE(is_active, TRUE) = TRUE`,
      [problem_id]
    );

    if (problemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const problem = problemResult.rows[0];
    const currentState = await getCurrentLanguageState(db, studentId, problem.language);

    if (!currentState || currentState.progress.is_completed || !currentState.currentProblem) {
      return res.status(409).json({ message: 'This language is already complete or not available.' });
    }

    if (currentState.currentProblem.id !== problem.id) {
      return res.status(409).json({ message: 'Solve the current unlocked task first.' });
    }

    const execution = await executeCodeAgainstTests({
      language: problem.language,
      sourceCode: submitted_code,
      testCases: problem.test_cases,
    });

    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const resultInsert = await client.query(
        `INSERT INTO coding_results (student_id, problem_id, score, passed, mode, submitted_code)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [studentId, problem.id, execution.score, execution.passed, mode, submitted_code]
      );

      if (mode === 'score') {
        await refreshCodingScore(client, studentId);
      }

      if (execution.passed) {
        const nextTaskNumber =
          problem.task_number >= currentState.progress.total_tasks
            ? currentState.progress.total_tasks + 1
            : problem.task_number + 1;

        await client.query(
          `UPDATE coding_progress
           SET completed_count = GREATEST(completed_count, $1),
               current_task_number = CASE
                 WHEN current_task_number = $2 THEN $3
                 ELSE current_task_number
               END,
               updated_at = NOW()
           WHERE student_id = $4 AND language = $5`,
          [problem.task_number, problem.task_number, nextTaskNumber, studentId, problem.language]
        );
      }

      await client.query('COMMIT');

      const updatedState = await getCurrentLanguageState(db, studentId, problem.language);
      const unlockedNextTask = execution.passed ? formatProblem(updatedState?.currentProblem) : null;

      res.json({
        result: resultInsert.rows[0],
        score: execution.score,
        passed: execution.passed,
        message: execution.passed
          ? unlockedNextTask
            ? 'All tests passed. The next task is now unlocked.'
            : 'All tests passed. You completed every task for this language.'
          : 'Some tests failed. Stay on the current task and try again.',
        feedback: execution.feedback,
        completed_count: updatedState?.progress.completed_count ?? currentState.progress.completed_count,
        current_task_number: updatedState?.progress.current_task_number ?? currentState.progress.current_task_number,
        unlocked_next_task: unlockedNextTask,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('submitCode error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/coding/results/me
const getMyResults = async (req, res) => {
  try {
    const studentId = await getStudentIdForUser(db, req.user.id);
    if (!studentId) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const result = await db.query(
      `SELECT
         results.*,
         problems.title,
         problems.difficulty,
         problems.language,
         problems.language_level,
         problems.task_number
       FROM coding_results results
       JOIN coding_problems problems ON problems.id = results.problem_id
       WHERE results.student_id = $1
       ORDER BY results.submitted_at DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('getMyResults error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentProblem,
  getMyProgress,
  getMyResults,
  getProblemById,
  getProblems,
  submitCode,
};
