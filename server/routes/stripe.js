const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const { createCheckoutSession, getSession } = require('../controllers/stripeController');


router.post('/create-checkout-session', authGuard, createCheckoutSession);
router.get('/session/:sessionId', getSession);

module.exports = router;