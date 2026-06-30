const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Task = require('../models/Task');

// POST /api/projects - create a project inside a workspace
const createProject = async (req,res) => {
    try{
        const {name, workspaceId} = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({message: 'Project name is required'});
        }
        if (!workspaceId) {
            return res.status(400).json({message: 'workspaceId is required'});
        }

      
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message:'workspace not found'});
        }

       
        const isMember = workspace.members.some(
            (m) => m.user.toString() === req.user.id
        );
        if (!isMember) {
            return res.status(403).json({message:'Forbidden - you are not a member of this workspace'});
        }

        const project = await Project.create({
            name: name.trim(),
            workspace:workspaceId,
            createdBy:req.user.id,
        });

        res.status(201).json(project);
    }catch(err) {
        res.status(500).json({message:'server error', error:err.message});
    }
};

// GET /api/projects?workspaceId=xxx - get all projects in a workspace
const getProjects = async (req, res) => {
    try{
        const {workspaceId} = req.query;

        if (!workspaceId) {
            return res.status(400).json({message: 'workspaceId query param is required'});
        }

        const projects = await Project.find({workspace:workspaceId})
        .populate('createdBy', 'name email');

        res.status(200).json(projects);
    }catch(err){
        res.status(500).json({message:'server error', error: err.message});
    }
};

// PUT /api/projects/:id - update a project 
const updateProject = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project) {
            return res.status(404).json({message:'Project not found'});
        }

        if(project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message: 'Forbidden - not the project creator'});
        }

        if (req.body.name !== undefined) {
            if (!req.body.name.trim()) {
                return res.status(400).json({message: 'Project name cannot be empty'});
            }
            project.name = req.body.name.trim();
        }
        if(req.body.columns) project.columns = req.body.columns;
        await project.save();

        res.status(200).json(project);
    }catch(err) {
        res.status(500).json({message:'server error', error: err.message});
    }
};

// DELETE /api/projects/:id - delete 
const deleteProject = async (req,res) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project) {
            return res.status(404).json({message:'Project not found'});
        }

        if(project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message: 'Forbidden - not the project creator'});
        }

        
        await Task.deleteMany({ project: project._id });

        await project.deleteOne();

        res.status(200).json({message:'Project deleted'});
    }catch(err) {
        res.status(500).json({message:'server error', error:err.message});
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject};
