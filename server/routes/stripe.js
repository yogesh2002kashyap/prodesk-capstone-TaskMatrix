const express = require('express');
const router = express.Router();


const {
    createCheckoutSession,
    getSession,
} = require('../controllers/stripeController');
const { validateParams } = require('../middleware/validate');
const { sessionParamSchema } = require('../validators/schemas');

router.post('/create-checkout-session',  createCheckoutSession);

router.get(
    '/session/:sessionId',
    validateParams(sessionParamSchema),
    getSession
);

module.exports = router;