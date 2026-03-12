const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getProblems, getProblemById, submitCode, getMyResults } = require('../controllers/codingController');

router.get('/problems', authenticate, getProblems);
router.get('/problems/:id', authenticate, getProblemById);
router.post('/submit', authenticate, requireRole('student'), submitCode);
router.get('/results/me', authenticate, requireRole('student'), getMyResults);

module.exports = router;
