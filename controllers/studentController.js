const db = require('../db');

// GET /api/students/me
const getMyProfile = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.email, u.is_approved,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS skills
       FROM students s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN student_skills ss ON ss.student_id = s.id
       LEFT JOIN skills sk ON sk.id = ss.skill_id
       WHERE s.user_id = $1
       GROUP BY s.id, u.email, u.is_approved`,
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getMyProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/students/me
const updateMyProfile = async (req, res) => {
  const { full_name, phone, department, year_of_study, cgpa, bio, linkedin_url, github_url, resume_url, skills } = req.body;
  try {
    const studentRes = await db.query('SELECT id FROM students WHERE user_id=$1', [req.user.id]);
    if (studentRes.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
    const studentId = studentRes.rows[0].id;

    await db.query(
      `UPDATE students SET full_name=$1, phone=$2, department=$3, year_of_study=$4,
       cgpa=$5, bio=$6, linkedin_url=$7, github_url=$8, resume_url=$9
       WHERE id=$10`,
      [full_name, phone, department, year_of_study, cgpa, bio, linkedin_url, github_url, resume_url, studentId]
    );

    // Update skills
    if (Array.isArray(skills)) {
      await db.query('DELETE FROM student_skills WHERE student_id=$1', [studentId]);
      for (const skillName of skills) {
        let skillRow = await db.query('SELECT id FROM skills WHERE name=$1', [skillName]);
        if (skillRow.rows.length === 0) {
          skillRow = await db.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName]);
        }
        const skillId = skillRow.rows[0].id;
        await db.query(
          'INSERT INTO student_skills (student_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [studentId, skillId]
        );
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('updateMyProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/students/matched-jobs  – jobs sorted by skill match %
const getMatchedJobs = async (req, res) => {
  try {
    const studentRes = await db.query(
      `SELECT s.id, s.cgpa, s.coding_score,
        COALESCE(array_agg(ss.skill_id) FILTER (WHERE ss.skill_id IS NOT NULL), '{}') AS skill_ids
       FROM students s
       LEFT JOIN student_skills ss ON ss.student_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id`,
      [req.user.id]
    );
    if (studentRes.rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
    const student = studentRes.rows[0];
    const studentSkillIds = student.skill_ids.map(Number);

    const jobsRes = await db.query(
      `SELECT j.*, c.company_name, c.logo_url,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS required_skills
       FROM jobs j
       JOIN companies c ON c.id = j.company_id
       LEFT JOIN job_skills js ON js.job_id = j.id
       LEFT JOIN skills sk ON sk.id = js.skill_id
       WHERE j.status = 'open'
       GROUP BY j.id, c.company_name, c.logo_url`
    );

    const jobs = jobsRes.rows.map((job) => {
      const requiredIds = job.required_skills.map((s) => s.id);
      const matched = studentSkillIds.filter((id) => requiredIds.includes(id)).length;
      const total = requiredIds.length || 1;
      const matchPercent = Math.round((matched / total) * 100);
      const eligible =
        matchPercent >= 50 &&
        (parseFloat(student.cgpa) || 0) >= (parseFloat(job.min_cgpa) || 0) &&
        (parseInt(student.coding_score) || 0) >= (parseInt(job.min_coding_score) || 0);
      return { ...job, matchPercent, eligible };
    });

    jobs.sort((a, b) => b.matchPercent - a.matchPercent);
    res.json(jobs);
  } catch (err) {
    console.error('getMatchedJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/students (admin)
const getAllStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.email, u.is_approved,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS skills
       FROM students s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN student_skills ss ON ss.student_id = s.id
       LEFT JOIN skills sk ON sk.id = ss.skill_id
       GROUP BY s.id, u.email, u.is_approved
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getAllStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyProfile, updateMyProfile, getMatchedJobs, getAllStudents };
