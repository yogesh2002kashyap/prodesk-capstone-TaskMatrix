const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace} = require('../controllers/workspaceController');
const {validate} = require('../middleware/validate');
const { workspaceSchema } = require('../validators/schemas');

router.post('/', authGuard, validate(workspaceSchema), createWorkspace);
router.get('/', authGuard, getWorkspaces);
router.put('/:id', authGuard, validate(workspaceSchema), updateWorkspace);
router.delete('/:id', authGuard, deleteWorkspace);

module.exports = router;