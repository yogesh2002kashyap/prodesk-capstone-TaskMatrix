const express = require('express');
const router = express.Router();
const { register, login,logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', validate(registerSchema), register);
router.post('/login', authLimiter,validate(loginSchema), login);
router.post('/logout', logout);

module.exports = router;