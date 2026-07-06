const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const validate = require('../middleware/validate');
const { aiSuggestSchema } = require('../validators/schemas');
const { suggestSubtasks } = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/suggest', authGuard,aiLimiter, validate(aiSuggestSchema), suggestSubtasks);

module.exports = router;