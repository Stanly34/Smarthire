const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, getAllJobs } = require('../controllers/jobController');

router.get('/', authenticate, getJobs);
router.get('/company/mine', authenticate, requireRole('company'), getMyJobs);
router.get('/admin/all', authenticate, requireRole('admin'), getAllJobs);
router.get('/:id', authenticate, getJobById);
router.post('/', authenticate, requireRole('company'), createJob);
router.put('/:id', authenticate, requireRole('company'), updateJob);
router.delete('/:id', authenticate, requireRole('company'), deleteJob);

module.exports = router;
