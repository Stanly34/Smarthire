const db = require('../db');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [students, companies, jobs, applications, placements, topSkills, jobsPerCompany, studentsPerDept] = await Promise.all([
      db.query('SELECT COUNT(*) FROM students'),
      db.query('SELECT COUNT(*) FROM companies'),
      db.query('SELECT COUNT(*) FROM jobs'),
      db.query('SELECT COUNT(*) FROM applications'),
      db.query("SELECT COUNT(*) FROM applications WHERE status='selected'"),
      db.query(
        `SELECT sk.name, COUNT(*) AS count
         FROM student_skills ss JOIN skills sk ON sk.id=ss.skill_id
         GROUP BY sk.name ORDER BY count DESC LIMIT 10`
      ),
      db.query(
        `SELECT c.company_name, COUNT(j.id) AS job_count
         FROM companies c LEFT JOIN jobs j ON j.company_id=c.id
         GROUP BY c.company_name ORDER BY job_count DESC LIMIT 10`
      ),
      db.query(
        `SELECT department, COUNT(*) AS count
         FROM students WHERE department IS NOT NULL
         GROUP BY department ORDER BY count DESC`
      ),
    ]);

    const totalStudents = parseInt(students.rows[0].count);
    const totalPlaced = parseInt(placements.rows[0].count);
    const placementRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 0;

    res.json({
      totalStudents,
      totalCompanies: parseInt(companies.rows[0].count),
      totalJobs: parseInt(jobs.rows[0].count),
      totalApplications: parseInt(applications.rows[0].count),
      totalPlacements: totalPlaced,
      placementRate,
      topSkills: topSkills.rows,
      jobsPerCompany: jobsPerCompany.rows,
      studentsPerDept: studentsPerDept.rows,
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/approve-user/:id
const approveUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_approved=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'User approved' });
  } catch (err) {
    console.error('approveUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/reject-user/:id
const rejectUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_approved=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'User rejected/suspended' });
  } catch (err) {
    console.error('rejectUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/pending-users
const getPendingUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.role, u.created_at,
        CASE
          WHEN u.role='student' THEN (SELECT full_name FROM students WHERE user_id=u.id)
          WHEN u.role='company' THEN (SELECT company_name FROM companies WHERE user_id=u.id)
          ELSE 'Admin'
        END AS display_name
       FROM users u WHERE u.is_approved=false AND u.role != 'admin'
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getPendingUsers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats, approveUser, rejectUser, getPendingUsers };
