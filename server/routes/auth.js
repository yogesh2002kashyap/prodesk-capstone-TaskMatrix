const express = require('express');
const router = express.Router();
const { register, login,logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');

router.post('/register', validate(registerSchema), register);
router.post('/login',validate(loginSchema), login);
router.post('/logout', logout);

module.exports = router;