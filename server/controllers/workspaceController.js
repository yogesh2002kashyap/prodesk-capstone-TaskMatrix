const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/apiError');

// POST /api/workspaces - create a new workspace 
const createWorkspace = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return sendError(res, 400, 'Workspace name is required');
        }

        const workspace = await Workspace.create(
            {
                name: name.trim(),
                owner: req.user.id,
                members: [{user: req.user.id, role: 'admin'}]
            }
        );

        return sendSuccess(res, 201, workspace, 'Workspace created successfully');

    } catch(err) {
        next(err);
    }
};

//GET /api/workspaces - get all workspace
const getWorkspaces = async (req, res,next) => {
    try {
        const workspaces = await Workspace.find({
            'members.user': req.user.id,
        }).populate('owner', 'name email');

        return sendSuccess(res, 200, workspaces, 'Workspaces fetched successfully');
    } catch(err) {
        next(err);
    }
};

// PUT /api/workspaces/:id - updade workspace name
const updateWorkspace = async (req,res,next) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return sendError(res, 400, 'Workspace name is required');
        }

        const workspace = await Workspace.findById(req.params.id);

        if(!workspace) {
            return sendError(res, 404, 'workspace not found');
        }

        if(workspace.owner.toString() !== req.user.id) {
            return sendError(res, 403, 'Forbidden-Only workspace owner can update');
        }

        workspace.name = name.trim();
        await workspace.save();
        
        return sendSuccess(res, 200, workspace, 'Workspace updated successfully');
    } catch(err) {
        next(err);}
};

//DELETE /api/workspaces/:id - delete workspace by id 
const deleteWorkspace = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if(!workspace) {
            return sendError(res, 404, 'Workspace not found');
        }

        if(workspace.owner.toString() !== req.user.id) {
            return sendError(res, 403, 'Forbidden:only owner can delete');
        }

        const projects = await Project.find({ workspace: workspace._id });
        const projectIds = projects.map(p => p._id);
        await Task.deleteMany({ project: { $in: projectIds } });
        await Project.deleteMany({ workspace: workspace._id });

        await workspace.deleteOne();

        return sendSuccess(res, 200, null, 'Workspace deleted successfully');
    } catch(err) {
        next(err);}
};

module.exports = { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace};