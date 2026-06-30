const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Task = require('../models/Task');

// POST /api/workspaces - create a new workspace 
const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Workspace name is required' });
        }

        const workspace = await Workspace.create(
            {
                name: name.trim(),
                owner: req.user.id,
                members: [{user: req.user.id, role: 'admin'}]
            }
        );

        res.status(201).json(workspace);

    } catch(err) {
        res.status(500).json({ message: 'server error', error: err.message});
    }
};

//GET /api/workspaces - get all workspace
const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({
            'members.user': req.user.id,
        }).populate('owner', 'name email');

        res.status(200).json(workspaces);
    } catch(err) {
        res.status(500).json({message: 'server error', error:err.message});
    }
};

// PUT /api/workspaces/:id - updade workspace name
const updateWorkspace = async (req,res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Workspace name is required' });
        }

        const workspace = await Workspace.findById(req.params.id);

        if(!workspace) {
            return res.status(404).json({message:'workspace not found'});
        }

        if(workspace.owner.toString() !== req.user.id) {
            return res.status(403).json({message:'Forbidden-Only workspace owner can update'});
        }

        workspace.name = name.trim();
        await workspace.save();
        
        res.status(200).json(workspace);
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

//DELETE /api/workspaces/:id - delete workspace by id 
const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if(!workspace) {
            return res.status(404).json({message:'workspace not found'});
        }

        if(workspace.owner.toString() !== req.user.id) {
            return res.status(403).json({message:'Forbidden:only owner can delete'});
        }

        const projects = await Project.find({ workspace: workspace._id });
        const projectIds = projects.map(p => p._id);
        await Task.deleteMany({ project: { $in: projectIds } });
        await Project.deleteMany({ workspace: workspace._id });

        await workspace.deleteOne();

        res.status(200).json({message:'workspace has been deleted successfully'});
    } catch(err) {
        res.status(500).json({message:'server error', error:err.message});
    }
};

module.exports = { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace};