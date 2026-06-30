const Task = require('../models/Task');
const Project = require('../models/Project');

// POST /api/tasks - create a task inside a project
const createTask = async (req, res) => {
    try{
        const {title, description, priority, column, assignee, dueDate, projectId} = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({message: 'Task title is required'});
        }
        if (!projectId) {
            return res.status(400).json({message: 'projectId is required'});
        }

        const project = await Project.findById(projectId);
        if(!project) { return res.status(404).json({message:'Project not found'});}

        // Validate column against project's columns list
        const targetColumn = column || 'Backlog';
        if (!project.columns.includes(targetColumn)) {
            return res.status(400).json({
                message: `Invalid column. Must be one of: ${project.columns.join(', ')}`
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description,
            priority,
            column: targetColumn,
            assignee: assignee || null,
            dueDate: dueDate || null,
            project: projectId,
            createdBy: req.user.id,
        });

        res.status(201).json(task);
    }catch(err){
        res.status(500).json({message:'server error', error: err.message});
    }
};

// GET /api/tasks?projectId=xxx - get all tasks for a project
const getTasks = async (req, res) => {
    try{
        const {projectId} = req.query;

        if (!projectId) {
            return res.status(400).json({message: 'projectId query param is required'});
        }

        const tasks = await Task.find({project:projectId})
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email')
        .sort({createdAt: -1});

        res.status(200).json(tasks);
    }catch(err) {
        res.status(500).json({message:'server error', error: err.message});
    }
};

// PUT /api/tasks/:id - update a task
const updateTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({message:'task not found'});
        }

        if(task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message:'Forbidden - not the task creator'});
        }

        
        if (req.body.column !== undefined) {
            const project = await Project.findById(task.project);
            if (project && !project.columns.includes(req.body.column)) {
                return res.status(400).json({
                    message: `Invalid column. Must be one of: ${project.columns.join(', ')}`
                });
            }
        }

        const fields = ['title', 'description', 'priority', 'column', 'status', 'assignee', 'dueDate', 'isAtRisk'];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) task[field] = req.body[field];
        });

        await task.save();

        res.status(200).json(task);
    }catch(err) {
        res.status(500).json({message:'server error', error:err.message});
    }
};

// DELETE /api/tasks/:id - delete a task by id
const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({message:'Task not found'});
        }

        if(task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message:'Forbidden - you are not the task creator'});
        }

        await task.deleteOne();
        res.status(200).json({message:'Task deleted successfully'});
    }catch(err) {
        res.status(500).json({message:'server error', error:err.message});
    }
};

module.exports = {createTask, getTasks, updateTask, deleteTask};
