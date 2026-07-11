const express = require('express');
const router = express.Router();

const authGuard = require('../middleware/authGuard');
const {
    createCheckoutSession,
    getSession,
} = require('../controllers/stripeController');

router.post('/create-checkout-session',  createCheckoutSession);

router.get(
    '/session/:sessionId',
    authGuard,
    getSession
);

module.exports = router;