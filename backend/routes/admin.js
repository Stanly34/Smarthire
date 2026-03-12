const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getStats, approveUser, rejectUser, getPendingUsers } = require('../controllers/adminController');

router.get('/stats', authenticate, requireRole('admin'), getStats);
router.get('/pending-users', authenticate, requireRole('admin'), getPendingUsers);
router.put('/approve-user/:id', authenticate, requireRole('admin'), approveUser);
router.put('/reject-user/:id', authenticate, requireRole('admin'), rejectUser);

module.exports = router;
