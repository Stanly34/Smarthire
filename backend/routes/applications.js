const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus, getAllApplications } = require('../controllers/applicationController');

router.post('/', authenticate, requireRole('student'), applyToJob);
router.get('/my', authenticate, requireRole('student'), getMyApplications);
router.get('/admin/all', authenticate, requireRole('admin'), getAllApplications);
router.get('/job/:jobId', authenticate, requireRole('company'), getJobApplicants);
router.put('/:id/status', authenticate, requireRole('company'), updateApplicationStatus);

module.exports = router;
