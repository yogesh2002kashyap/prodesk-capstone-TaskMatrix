const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {createProject, getProjects, updateProject, deleteProject} = require('../controllers/projectController');

router.post('/', authGuard, createProject);
router.get('/', authGuard, getProjects);
router.put('/:id', authGuard, updateProject);
router.delete('/:id', authGuard, deleteProject);

module.exports = router;