const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/apiError');

// POST /api/projects - create a project inside a workspace
const createProject = async (req,res,next) => {
    try{
        const {name, workspaceId} = req.body;

        if (!name || !name.trim()) {
            return sendError(res, 400, 'Project name is required');
        }
        if (!workspaceId) {
            return sendError(res, 400, 'Workspace ID is required');
        }

      
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return sendError(res, 404, 'Workspace not found');
        }

       
        const isMember = workspace.members.some(
            (m) => m.user.toString() === req.user.id
        );
        if (!isMember) {
            return sendError(res, 403, 'Forbidden - you are not a member of this workspace');
        }

        const project = await Project.create({
            name: name.trim(),
            workspace:workspaceId,
            createdBy:req.user.id,
        });

        return sendSuccess(res, 201, project, 'Project created successfully');
    }catch(err) {
        next(err);
    }
};

// GET /api/projects?workspaceId=xxx - get all projects in a workspace
const getProjects = async (req, res, next) => {
    try{
        const {workspaceId} = req.query;

        if (!workspaceId) {
            return sendError(res, 400, 'workspaceId query param is required');
            
        }

        const projects = await Project.find({workspace:workspaceId})
        .populate('createdBy', 'name email');

        return sendSuccess(res, 200, projects, 'Projects fetched');
    }catch(err){
        next(err);
    }
};

// PUT /api/projects/:id - update a project 
const updateProject = async (req, res, next) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project) {
            return sendError(res, 404, 'Project not found');
        }

        if(project.createdBy.toString() !== req.user.id) {
            return sendError(res, 403, 'Forbidden - not the project creator');
        }

        if (req.body.name !== undefined) {
            if (!req.body.name.trim()) {
                return sendError(res, 400, 'Project name cannot be empty');
            }
            project.name = req.body.name.trim();
        }
        if(req.body.columns) project.columns = req.body.columns;
        await project.save();

        return sendSuccess(res, 200, project, 'Project updated successfully');
    }catch(err) {
        next(err);
    }
};

// DELETE /api/projects/:id - delete 
const deleteProject = async (req,res,next) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project) {
            return sendError(res, 404, 'Project not found');
        }

        if(project.createdBy.toString() !== req.user.id) {
            return sendError(res, 403, 'Forbidden - not the project creator');
        }

        
        await Task.deleteMany({ project: project._id });

        await project.deleteOne();

        return sendSuccess(res, 200, null, 'Project deleted successfully');
    }catch(err) {
        next(err);
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject};
