const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/register-student
const registerStudent = async (req, res) => {
  const { email, password, full_name, phone, department, year_of_study, cgpa } = req.body;
  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'Email, password and full name are required' });
  }
  try {
    const existing = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (email, password, role, is_approved) VALUES ($1,$2,$3,$4) RETURNING *',
      [email, hashed, 'student', false]
    );
    const user = userResult.rows[0];
    await db.query(
      `INSERT INTO students (user_id, full_name, phone, department, year_of_study, cgpa)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [user.id, full_name, phone || null, department || null, year_of_study || null, cgpa || null]
    );
    res.status(201).json({ message: 'Student registered successfully. Awaiting admin approval.' });
  } catch (err) {
    console.error('registerStudent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/register-company
const registerCompany = async (req, res) => {
  const { email, password, company_name, industry, website, location, contact_person, phone } = req.body;
  if (!email || !password || !company_name) {
    return res.status(400).json({ message: 'Email, password and company name are required' });
  }
  try {
    const existing = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (email, password, role, is_approved) VALUES ($1,$2,$3,$4) RETURNING *',
      [email, hashed, 'company', false]
    );
    const user = userResult.rows[0];
    await db.query(
      `INSERT INTO companies (user_id, company_name, industry, website, location, contact_person, phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [user.id, company_name, industry || null, website || null, location || null, contact_person || null, phone || null]
    );
    res.status(201).json({ message: 'Company registered successfully. Awaiting admin approval.' });
  } catch (err) {
    console.error('registerCompany error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.is_approved && user.role !== 'admin') {
      return res.status(403).json({ message: 'Your account is pending admin approval or has been suspended. Please contact the administrator.' });
    }
    const token = generateToken(user);

    // Fetch profile id
    let profileId = null;
    if (user.role === 'student') {
      const s = await db.query('SELECT id FROM students WHERE user_id=$1', [user.id]);
      profileId = s.rows[0]?.id;
    } else if (user.role === 'company') {
      const c = await db.query('SELECT id FROM companies WHERE user_id=$1', [user.id]);
      profileId = c.rows[0]?.id;
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerStudent, registerCompany, login };
