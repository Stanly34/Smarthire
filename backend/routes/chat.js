const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { sendMessage, getMessages, getContacts } = require('../controllers/chatController');

router.post('/send', authenticate, sendMessage);
router.get('/messages/:userId', authenticate, getMessages);
router.get('/contacts', authenticate, getContacts);

module.exports = router;
