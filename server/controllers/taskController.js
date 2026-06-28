const Task = require('../models/Task');
const Project = require('../models/Project');

// POST //api/tasks - create a task inside a project
const createTask = async (req, res) => {
    try{
        const {title, description, priority, column, assignee, dueDate, projectId} = req.body;

        const project = await Project.findById(projectId);
        if(!project) { return res.status(404).jaon({message:'Project not found'});}

        const task = await Task.create({
            title,
            description,
            priority,
            column: column || 'Backlog',
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

//GET /api/tasks?projectId=xxx - get all tasksfor a project
const getTasks = async (req, res) => {
    try{
        const {projectId} = req.query;

        const tasks = await Task.find({project:projectId})
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email')
        .sort({createdAt: -1});

        res.status(200).json(tasks);
    }catch(err) {
        res.status(500).json({message:'server error', error: err.message});
    }
};

//PUT /api/tasks/:id - update a task
const updateTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).jaon({message:'task not found'});
        }

        if(task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({messsage:'Forbidden-you are not a task creator'});
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
            return res.status(404).json({message:'Task not found '});
        }

        if(task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message:'Forbidden- you are not creator'});
        }

        await task.deleteOne();
        res.status(200).json({message:'Task deleted successfully'});
    }catch(err) {
        res.status(500).json({message:'server error', erro:err.message})
    }
};

module.exports = {createTask, getTasks, updateTask, deleteTask};