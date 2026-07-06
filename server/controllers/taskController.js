const Task = require('../models/Task');
const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/apiError');

// POST /api/tasks - create a task inside a project
const createTask = async (req, res, next) => {
    try{
        const {title, description, priority, column, assignee, dueDate, projectId} = req.body;

        if (!title || !title.trim()) {
            return sendError(res, 400, 'Task title is required');
        }
        if (!projectId) {
            return sendError(res, 400, 'Project ID is required');
        }

        const project = await Project.findById(projectId);
        if(!project) { return sendError(res, 404, 'Project not found');}

        // Validate column against project's columns list
        const targetColumn = column || 'Backlog';
        if (!project.columns.includes(targetColumn)) {
            return sendError(res, 400, `Invalid column. Must be one of: ${project.columns.join(', ')}`);
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

        return sendSuccess(res, 201, task, 'Task created successfully');
    }catch(err){
        next(err);}
};

// GET /api/tasks?projectId=xxx - get all tasks for a project
const getTasks = async (req, res, next) => {
    try{
        const {projectId} = req.query;

        if (!projectId) {
            return sendError(res, 400, 'projectId query param is required');
        }

        const tasks = await Task.find({project:projectId})
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email')
        .sort({createdAt: -1});

        return sendSuccess(res, 200, tasks, 'Tasks fetched successfully');
    }catch(err) {
        next(err);
    }
};

// PUT /api/tasks/:id - update a task
const updateTask = async (req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) {
            return sendError(res, 404, 'Task not found');
        }

        if(task.createdBy.toString() !== req.user.id) {
            return sendError(res, 403, 'Forbidden - not the task creator');
        }

        
        if (req.body.column !== undefined) {
            const project = await Project.findById(task.project);
            if (project && !project.columns.includes(req.body.column)) {
                return sendError(res, 400, `Invalid column. Must be one of: ${project.columns.join(', ')}`);
            }
        }

        const fields = ['title', 'description', 'priority', 'column', 'status', 'assignee', 'dueDate', 'isAtRisk'];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) task[field] = req.body[field];
        });

        await task.save();

        return sendSuccess(res, 200, task, 'Task updated successfully');
    }catch(err) {
        next(err);
    }
};

// DELETE /api/tasks/:id - delete a task by id
const deleteTask = async (req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) {
            return sendError(res, 404, 'Task not found');
        }

        if(task.createdBy.toString() !== req.user.id) {
            return sendError(res, 403, 'Forbidden - you are not the task creator');
        }

        await task.deleteOne();
        return sendSuccess(res, 200, null, 'Task deleted successfully');
    }catch(err) {
        next(err);
    }
};

module.exports = {createTask, getTasks, updateTask, deleteTask};
