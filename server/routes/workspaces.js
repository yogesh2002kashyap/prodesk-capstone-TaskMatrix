const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace} = require('../controllers/workspaceController');

router.post('/', authGuard, createWorkspace);
router.get('/', authGuard, getWorkspaces);
router.put('/:id', authGuard, updateWorkspace);
router.delete('/:id', authGuard, deleteWorkspace);

module.exports = router;