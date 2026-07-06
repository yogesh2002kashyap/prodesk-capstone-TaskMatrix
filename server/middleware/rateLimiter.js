const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again in 15 minutes',
    },
    standardHeaders: true,
    lagacyHeaders: false,
});

const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many AI requests. Please wait moment before trying again.',
    },
    standardHeaders: true,
    lagacyHeaders: false,
});

module.exports = { authLimiter, aiLimiter };