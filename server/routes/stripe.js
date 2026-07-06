const express = require('express');
const router = express.Router();

const authGuard = require('../middleware/authGuard');
const {
    createCheckoutSession,
    getSession,
} = require('../controllers/stripeController');
const { validateParams } = require('../middleware/validate');
const { sessionParamSchema } = require('../validators/schemas');

router.post('/create-checkout-session', authGuard, createCheckoutSession);

router.get(
    '/session/:sessionId',
    authGuard,
    validateParams(sessionParamSchema),
    getSession
);

module.exports = router;