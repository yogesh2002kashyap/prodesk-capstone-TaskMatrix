const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/authController');
const authGuard = require('../middleware/authGuard');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', validate(registerSchema), register);

router.post(
    '/login',
    authLimiter,
    validate(loginSchema),
    login
);

router.post('/logout', authGuard, logout);

module.exports = router;