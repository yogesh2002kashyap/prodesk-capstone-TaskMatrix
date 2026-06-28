const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {createTask, getTasks, updateTask, deleteTask} = require('../controllers/taskController');

router.post('/', authGuard, createTask);
router.get('/', authGuard, getTasks);
router.put('/:id', authGuard, updateTask);
router.delete('/:id', authGuard, deleteTask);

module.exports = router;