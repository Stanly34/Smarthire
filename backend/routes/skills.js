const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const db = require('../db');

// GET /api/skills – list all available skills
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM skills ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getSkills error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
