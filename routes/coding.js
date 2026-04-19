const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getCurrentProblem,
  getMyProgress,
  getMyResults,
  getProblemById,
  getProblems,
  submitCode,
} = require('../controllers/codingController');

router.get('/problems', authenticate, getProblems);
router.get('/problems/:id', authenticate, getProblemById);
router.get('/progress/me', authenticate, requireRole('student'), getMyProgress);
router.get('/current', authenticate, requireRole('student'), getCurrentProblem);
router.post('/submit', authenticate, requireRole('student'), submitCode);
router.get('/results/me', authenticate, requireRole('student'), getMyResults);

module.exports = router;
