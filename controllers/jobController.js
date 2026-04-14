const db = require('../db');

// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT j.*, c.company_name, c.logo_url, c.location AS company_location,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS required_skills,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) AS application_count
       FROM jobs j
       JOIN companies c ON c.id=j.company_id
       LEFT JOIN job_skills js ON js.job_id=j.id
       LEFT JOIN skills sk ON sk.id=js.skill_id
       WHERE j.status='open'
       GROUP BY j.id, c.company_name, c.logo_url, c.location
       ORDER BY j.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT j.*, c.company_name, c.logo_url, c.description AS company_desc, c.website,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS required_skills
       FROM jobs j
       JOIN companies c ON c.id=j.company_id
       LEFT JOIN job_skills js ON js.job_id=j.id
       LEFT JOIN skills sk ON sk.id=js.skill_id
       WHERE j.id=$1
       GROUP BY j.id, c.company_name, c.logo_url, c.description, c.website`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getJobById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/jobs (company)
const createJob = async (req, res) => {
  const { title, description, location, salary_range, job_type, min_cgpa, min_coding_score, interview_date, deadline, skills } = req.body;
  if (!title) return res.status(400).json({ message: 'Job title is required' });
  try {
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });
    const companyId = compRes.rows[0].id;

    const jobResult = await db.query(
      `INSERT INTO jobs (company_id, title, description, location, salary_range, job_type, min_cgpa, min_coding_score, interview_date, deadline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [companyId, title, description, location, salary_range, job_type || 'full-time', min_cgpa || 0, min_coding_score || 0, interview_date || null, deadline || null]
    );
    const job = jobResult.rows[0];

    if (Array.isArray(skills)) {
      for (const skillName of skills) {
        let skillRow = await db.query('SELECT id FROM skills WHERE name=$1', [skillName]);
        if (skillRow.rows.length === 0) {
          skillRow = await db.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName]);
        }
        await db.query(
          'INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [job.id, skillRow.rows[0].id]
        );
      }
    }

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    console.error('createJob error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/jobs/:id (company)
const updateJob = async (req, res) => {
  const { title, description, location, salary_range, job_type, min_cgpa, min_coding_score, interview_date, deadline, status, skills } = req.body;
  if (status && !['open', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be open or closed' });
  }
  try {
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    const jobRes = await db.query('SELECT id FROM jobs WHERE id=$1 AND company_id=$2', [req.params.id, compRes.rows[0].id]);
    if (jobRes.rows.length === 0) return res.status(404).json({ message: 'Job not found' });

    await db.query(
      `UPDATE jobs SET title=$1, description=$2, location=$3, salary_range=$4, job_type=$5,
       min_cgpa=$6, min_coding_score=$7, interview_date=$8, deadline=$9, status=$10
       WHERE id=$11`,
      [title, description, location, salary_range, job_type, min_cgpa, min_coding_score, interview_date, deadline, status, req.params.id]
    );

    if (Array.isArray(skills)) {
      await db.query('DELETE FROM job_skills WHERE job_id=$1', [req.params.id]);
      for (const skillName of skills) {
        let skillRow = await db.query('SELECT id FROM skills WHERE name=$1', [skillName]);
        if (skillRow.rows.length === 0) {
          skillRow = await db.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName]);
        }
        await db.query(
          'INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [req.params.id, skillRow.rows[0].id]
        );
      }
    }

    res.json({ message: 'Job updated' });
  } catch (err) {
    console.error('updateJob error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/jobs/:id (company)
const deleteJob = async (req, res) => {
  try {
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });
    await db.query('DELETE FROM jobs WHERE id=$1 AND company_id=$2', [req.params.id, compRes.rows[0].id]);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('deleteJob error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs/company/mine (company's own jobs)
const getMyJobs = async (req, res) => {
  try {
    const compRes = await db.query('SELECT id FROM companies WHERE user_id=$1', [req.user.id]);
    if (compRes.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    const result = await db.query(
      `SELECT j.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sk.id, 'name', sk.name)) FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS required_skills,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) AS application_count
       FROM jobs j
       LEFT JOIN job_skills js ON js.job_id=j.id
       LEFT JOIN skills sk ON sk.id=js.skill_id
       WHERE j.company_id=$1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [compRes.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getMyJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs (admin - all jobs)
const getAllJobs = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT j.*, c.company_name,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) AS application_count
       FROM jobs j
       JOIN companies c ON c.id=j.company_id
       ORDER BY j.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getAllJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, getAllJobs };
