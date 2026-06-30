const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'title name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['backlog', 'in-progress', 'in-review', 'done'],
            default: 'backlog',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        column: {
            type: String,
            default: 'Backlog',
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        isAtRisk: {
            type: Boolean,
            default: false,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

taskSchema.index({ project: 1 });
taskSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Task', taskSchema);