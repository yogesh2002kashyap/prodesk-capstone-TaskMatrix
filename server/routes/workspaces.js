const express = require('express');
const router = express.Router();
const authGaurd = require('../middleware/authGuard');
const { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace} = require('../controllers/workspaceController');

router.post('/', authGaurd, createWorkspace);
router.get('/', authGaurd, getWorkspaces);
router.put('/:id', authGaurd, updateWorkspace);
router.delete('/:id', authGaurd, deleteWorkspace);

module.exports = router;