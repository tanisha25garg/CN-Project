const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', register);

// @route POST /api/auth/login
// @desc Log in user and return JWT
router.post('/login', login);

module.exports = router;
