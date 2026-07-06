const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiError');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return sendError(
            res,
            429,
            'Too many login attempts. Please try again in 15 minutes.'
        );
    },
});

const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return sendError(
            res,
            429,
            'Too many AI requests. Please wait a moment before trying again.'
        );
    },
});

module.exports = {
    authLimiter,
    aiLimiter,
};