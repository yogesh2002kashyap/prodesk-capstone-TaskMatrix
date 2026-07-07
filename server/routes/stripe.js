const express = require('express');
const router = express.Router();

const {
    createCheckoutSession,
    getSession,
} = require('../controllers/stripeController');

router.post('/create-checkout-session',  createCheckoutSession);

router.get(
    '/session/:sessionId',
    getSession
);

module.exports = router;