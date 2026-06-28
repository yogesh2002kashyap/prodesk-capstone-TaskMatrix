const Workspace = require('../models/Workspace');
const Project = require('../models/Project');

// POST /api/projects - create a project inside a workspace
const createProject = async (req,res) => {
    try{
        const {name, workspaceId} = req.body;

        const workspace = await Workspace.findOne({
            _id: workspaceId,
            'members.user': req.user.id,
        });
        if(!workspace) {
            return res.status(404).json({message:'workspace not found'});
        }

        const project = await Project.create({
            name,
            workspace:workspaceId,
            createdBy:req.user.id,
        });

        res.status(201).json(project);
    }catch(err) {
        res.status(500).json({message:'server error', error:err.message});
    }
};

// GET /api/projects?workspaceId=xxx - get all project in a workspace
const getProjects = async (req, res) => {
    try{
        const {workspaceId} = req.query;

        const projects = await Project.find({workspace:workspaceId})
        .populate('createdBy', 'name email');

        res.status(200).json(projects);
    }catch(err){
        res.status(500).jaon({message:'server error', error: err.message});
    }
};

// PUT /api/projects/:id - update a project name or column
const updateProject = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project) {
            return res.status(404).json({message:'Project not found'});
        }

        if(project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message: 'Forbidden - not the project creator'});
        }

        project.name = req.body.name || project.name;
        if(req.body.columns) project.columns = req.body.columns;
        await project.save();

        res.status(200).json(project);
    }catch(err) {
        res.status(500).json({message:'server error', error: err.message});
    }
};

// DELETE /api/projects/:id - delete project by id
const deleteProject = async (req,res) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project) {
            return res.status(404).json({message:'Project not found'});
        }

        if(project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({message: 'Forbidden - not the project creator'});
        }

        await project.deleteOne();

        res.status(200).json({message:'Project deleted'});
    }catch(err) {
        res.status(500).json({message:'server eerror', error:err.message});
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject};