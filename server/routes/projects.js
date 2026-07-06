const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { validate } = require('../middleware/validate');
const {
    projectSchema,
    updateProjectSchema,
} = require('../validators/schemas');

router.post('/', authGuard, validate(projectSchema), createProject);
router.get('/', authGuard, getProjects);
router.put('/:id', authGuard, validate(updateProjectSchema), updateProject);
router.delete('/:id', authGuard, deleteProject);

module.exports = router;