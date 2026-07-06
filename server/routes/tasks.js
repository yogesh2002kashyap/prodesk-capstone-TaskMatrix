const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {createTask, getTasks, updateTask, deleteTask} = require('../controllers/taskController');
const { validate } = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../validators/schemas');

router.post('/', authGuard, validate(createTaskSchema), createTask);
router.get('/', authGuard, getTasks);
router.put('/:id', authGuard, validate(updateTaskSchema), updateTask);
router.delete('/:id', authGuard, deleteTask);

module.exports = router;