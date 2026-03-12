const db = require('../db');

// GET /api/coding/problems
const getProblems = async (req, res) => {
  try {
    const { difficulty, language } = req.query;
    let query = 'SELECT * FROM coding_problems WHERE 1=1';
    const params = [];
    if (difficulty) { params.push(difficulty); query += ` AND difficulty=$${params.length}`; }
    if (language) { params.push(language); query += ` AND language=$${params.length}`; }
    query += ' ORDER BY difficulty, id';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getProblems error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/coding/problems/:id
const getProblemById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM coding_problems WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Problem not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getProblemById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/coding/submit
// Simulated code execution – in production integrate with Judge0 or similar
const submitCode = async (req, res) => {
  const { problem_id, submitted_code, mode, language } = req.body;
  if (!problem_id || !submitted_code || !mode) {
    return res.status(400).json({ message: 'problem_id, submitted_code, and mode are required' });
  }
  try {
    const studentRes = await db.query('SELECT id FROM students WHERE user_id=$1', [req.user.id]);
    if (studentRes.rows.length === 0) return res.status(404).json({ message: 'Student profile not found' });
    const studentId = studentRes.rows[0].id;

    const problemRes = await db.query('SELECT * FROM coding_problems WHERE id=$1', [problem_id]);
    if (problemRes.rows.length === 0) return res.status(404).json({ message: 'Problem not found' });

    // Simulated scoring: random score between 60-100 for demo
    const score = Math.floor(Math.random() * 41) + 60;
    const passed = score >= 70;

    const resultRow = await db.query(
      `INSERT INTO coding_results (student_id, problem_id, score, mode, submitted_code)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [studentId, problem_id, score, mode, submitted_code]
    );

    // If score mode, update student's coding_score (average of all score-mode results)
    if (mode === 'score') {
      const avgRes = await db.query(
        `SELECT ROUND(AVG(score)) AS avg_score FROM coding_results
         WHERE student_id=$1 AND mode='score'`,
        [studentId]
      );
      const avgScore = parseInt(avgRes.rows[0].avg_score) || 0;
      await db.query('UPDATE students SET coding_score=$1 WHERE id=$2', [avgScore, studentId]);
    }

    res.json({
      result: resultRow.rows[0],
      score,
      passed,
      message: passed ? 'Test passed!' : 'Test failed. Try again.',
      feedback: passed
        ? 'Great work! Your solution is correct.'
        : 'Your solution did not produce the expected output. Review your logic.',
    });
  } catch (err) {
    console.error('submitCode error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/coding/results/me
const getMyResults = async (req, res) => {
  try {
    const studentRes = await db.query('SELECT id FROM students WHERE user_id=$1', [req.user.id]);
    if (studentRes.rows.length === 0) return res.status(404).json({ message: 'Student profile not found' });

    const result = await db.query(
      `SELECT cr.*, cp.title, cp.difficulty, cp.language
       FROM coding_results cr
       JOIN coding_problems cp ON cp.id=cr.problem_id
       WHERE cr.student_id=$1
       ORDER BY cr.submitted_at DESC`,
      [studentRes.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getMyResults error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProblems, getProblemById, submitCode, getMyResults };
