const db = require('../db');

// POST /api/applications  (student)
const applyToJob = async (req, res) => {
  const { job_id } = req.body;
  if (!job_id) return res.status(400).json({ message: 'job_id is required' });
  try {
    // Ensure student exists AND their account is approved
    const studentRes = await db.query(
      `SELECT s.id FROM students s JOIN users u ON u.id=s.user_id
       WHERE s.user_id=$1 AND u.is_approved=true`,
      [req.user.id]
    );
    if (studentRes.rows.length === 0) return res.status(403).json({ message: 'Student profile not found or account not approved' });
    const studentId = studentRes.rows[0].id;

    const jobRes = await db.query('SELECT id FROM jobs WHERE id=$1 AND status=$2', [job_id, 'open']);
    if (jobRes.rows.length === 0) return res.status(404).json({ message: 'Job not found or closed' });

    await db.query(
      'INSERT INTO applications (student_id, job_id) VALUES ($1,$2)',
      [studentId, job_id]
    );
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Already applied to this job' });
    console.error('applyToJob error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications/my  (student)
const getMyApplications = async (req, res) => {
  try {
    const studentRes = await db.query('SELECT id FROM students WHERE user_id=$1', [req.user.id]);
    if (studentRes.rows.length === 0) return res.status(404).json({ message: 'Student profile not found' });

    const result = await db.query(
      `SELECT a.*, j.title, j.location, j.salary_range, j.job_type, j.interview_date,
        c.company_name, c.logo_url,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS required_skills
       FROM applications a
       JOIN jobs j ON j.id=a.job_id
       JOIN companies c ON c.id=j.company_id
       LEFT JOIN job_skills js ON js.job_id=j.id
       LEFT JOIN skills sk ON sk.id=js.skill_id
       WHERE a.student_id=$1
       GROUP BY a.id, j.title, j.location, j.salary_range, j.job_type, j.interview_date, c.company_name, c.logo_url
       ORDER BY a.applied_at DESC`,
      [studentRes.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getMyApplications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs/:jobId/applicants  (company)
const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;
  try {
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    const jobRes = await db.query('SELECT id FROM jobs WHERE id=$1 AND company_id=$2', [jobId, compRes.rows[0].id]);
    if (jobRes.rows.length === 0) return res.status(404).json({ message: 'Job not found' });

    const result = await db.query(
      `SELECT a.id AS application_id, a.status, a.applied_at,
        s.id AS student_id, s.full_name, s.department, s.cgpa, s.coding_score, s.resume_url,
        u.email,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS skills
       FROM applications a
       JOIN students s ON s.id=a.student_id
       JOIN users u ON u.id=s.user_id
       LEFT JOIN student_skills ss ON ss.student_id=s.id
       LEFT JOIN skills sk ON sk.id=ss.skill_id
       WHERE a.job_id=$1
       GROUP BY a.id, a.status, a.applied_at, s.id, s.full_name, s.department, s.cgpa, s.coding_score, s.resume_url, u.email
       ORDER BY a.applied_at DESC`,
      [jobId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getJobApplicants error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/applications/:id/status  (company)
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['applied', 'shortlisted', 'rejected', 'selected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    // Verify the application belongs to a job owned by this company
    const appRes = await db.query(
      `SELECT a.id FROM applications a
       JOIN jobs j ON j.id=a.job_id
       WHERE a.id=$1 AND j.company_id=$2`,
      [req.params.id, compRes.rows[0].id]
    );
    if (appRes.rows.length === 0) return res.status(404).json({ message: 'Application not found' });

    await db.query(
      'UPDATE applications SET status=$1, updated_at=NOW() WHERE id=$2',
      [status, req.params.id]
    );
    res.json({ message: 'Application status updated' });
  } catch (err) {
    console.error('updateApplicationStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications (admin)
const getAllApplications = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, s.full_name AS student_name, j.title AS job_title, c.company_name
       FROM applications a
       JOIN students s ON s.id=a.student_id
       JOIN jobs j ON j.id=a.job_id
       JOIN companies c ON c.id=j.company_id
       ORDER BY a.applied_at DESC
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getAllApplications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus, getAllApplications };
