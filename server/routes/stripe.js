const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const { createCheckoutSession, getSession } = require('../controllers/stripeController');


router.post('/create-check-session', authGuard, createCheckoutSession);
router.get('/session/:sesionId', getSession);

module.exports = router;