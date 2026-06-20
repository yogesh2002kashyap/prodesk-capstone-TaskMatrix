const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const roleGuard = require('../middleware/roleGuard');

// Any authenticated user can GET tasks
router.get('/', authGuard, (req, res) => {
  res.json({ message: `Tasks fetched for user ${req.user.id}` });
});

// Only admins can DELETE tasks
router.delete('/:id', authGuard, roleGuard('admin'), (req, res) => {
  res.json({ message: `Task ${req.params.id} deleted by admin ${req.user.id}` });
});

module.exports = router;