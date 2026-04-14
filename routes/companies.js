const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getMyProfile, updateMyProfile, getAllCompanies, getEligibleStudents } = require('../controllers/companyController');

router.get('/me', authenticate, requireRole('company'), getMyProfile);
router.put('/me', authenticate, requireRole('company'), updateMyProfile);
router.get('/', authenticate, requireRole('admin'), getAllCompanies);
router.get('/eligible-students/:jobId', authenticate, requireRole('company'), getEligibleStudents);

module.exports = router;
