const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const validate = require('../middleware/validate');
const { aiSuggestSchema } = require('../validators/schemas');
const { suggestSubtasks } = require('../controllers/aiController');

router.post('/suggest', authGuard, validate(aiSuggestSchema), suggestSubtasks);

module.exports = router;