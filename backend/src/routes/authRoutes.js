const rateLimit = require('express-rate-limit');
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' }
});

router.post('/login', loginLimiter, login);

module.exports = router;