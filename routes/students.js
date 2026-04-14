const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getMyProfile, updateMyProfile, getMatchedJobs, getAllStudents } = require('../controllers/studentController');

router.get('/me', authenticate, requireRole('student'), getMyProfile);
router.put('/me', authenticate, requireRole('student'), updateMyProfile);
router.get('/matched-jobs', authenticate, requireRole('student'), getMatchedJobs);
router.get('/', authenticate, requireRole('admin'), getAllStudents);

module.exports = router;
