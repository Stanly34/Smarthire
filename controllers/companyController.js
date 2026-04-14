const db = require('../db');

// GET /api/companies/me
const getMyProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT c.*, u.email, u.is_approved FROM companies c JOIN users u ON u.id=c.user_id WHERE c.user_id=$1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Company profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getMyProfile (company) error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/companies/me
const updateMyProfile = async (req, res) => {
  const { company_name, industry, website, description, location, contact_person, phone } = req.body;
  try {
    await db.query(
      `UPDATE companies SET company_name=$1, industry=$2, website=$3, description=$4,
       location=$5, contact_person=$6, phone=$7 WHERE user_id=$8`,
      [company_name, industry, website, description, location, contact_person, phone, req.user.id]
    );
    res.json({ message: 'Company profile updated' });
  } catch (err) {
    console.error('updateMyProfile (company) error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/companies (admin)
const getAllCompanies = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.email, u.is_approved,
        (SELECT COUNT(*) FROM jobs j WHERE j.company_id=c.id) AS job_count
       FROM companies c
       JOIN users u ON u.id=c.user_id
       ORDER BY c.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getAllCompanies error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/companies/:id/eligible-students
const getEligibleStudents = async (req, res) => {
  const { jobId } = req.params;
  try {
    // Get company id from user
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    const jobRes = await db.query(
      `SELECT j.*, COALESCE(array_agg(js.skill_id) FILTER (WHERE js.skill_id IS NOT NULL), '{}') AS required_skill_ids
       FROM jobs j
       LEFT JOIN job_skills js ON js.job_id = j.id
       WHERE j.id=$1 AND j.company_id=$2
       GROUP BY j.id`,
      [jobId, compRes.rows[0].id]
    );
    if (jobRes.rows.length === 0) return res.status(404).json({ message: 'Job not found' });
    const job = jobRes.rows[0];
    const requiredSkillIds = job.required_skill_ids.map(Number);

    const studentsRes = await db.query(
      `SELECT s.*, u.email,
        COALESCE(array_agg(DISTINCT ss.skill_id) FILTER (WHERE ss.skill_id IS NOT NULL), '{}') AS skill_ids,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS skills
       FROM students s
       JOIN users u ON u.id=s.user_id AND u.is_approved=true
       LEFT JOIN student_skills ss ON ss.student_id=s.id
       LEFT JOIN skills sk ON sk.id=ss.skill_id
       GROUP BY s.id, u.email`
    );

    const eligible = studentsRes.rows
      .map((student) => {
        const studentSkillIds = student.skill_ids.map(Number);
        const matched = studentSkillIds.filter((id) => requiredSkillIds.includes(id)).length;
        const total = requiredSkillIds.length || 1;
        const matchPercent = Math.round((matched / total) * 100);
        return { ...student, matchPercent };
      })
      .filter(
        (s) =>
          s.matchPercent >= 50 &&
          (parseFloat(s.cgpa) || 0) >= (parseFloat(job.min_cgpa) || 0) &&
          (parseInt(s.coding_score) || 0) >= (parseInt(job.min_coding_score) || 0)
      )
      .sort((a, b) => b.matchPercent - a.matchPercent);

    res.json(eligible);
  } catch (err) {
    console.error('getEligibleStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyProfile, updateMyProfile, getAllCompanies, getEligibleStudents };
