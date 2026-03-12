const express = require('express');
const router = express.Router();
const { registerStudent, registerCompany, login } = require('../controllers/authController');

router.post('/register-student', registerStudent);
router.post('/register-company', registerCompany);
router.post('/login', login);

module.exports = router;
