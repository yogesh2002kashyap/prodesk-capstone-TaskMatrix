const { z } = require('zod');

const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .trim(),
    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase(),
    password: z
        .string()
        .min(1, 'Password is required'),
});

const workspaceSchema = z.object({
    name: z
        .string()
        .min(1, 'Workspace name is required')
        .max(50)
        .trim(),
});

const projectSchema = z.object({
    name: z
        .string()
        .min(1, 'Project name is required')
        .max(100)
        .trim(),
    workspaceId: z
        .string()
        .min(1, 'Workspace ID is required'),
});

const updateProjectSchema = z.object({
    name: z
        .string()
        .min(1, 'Project name is required')
        .max(100)
        .trim()
        .optional(),
});

const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200)
        .trim(),
    description: z
        .string()
        .max(2000)
        .optional()
        .default(''),
    priority: z
        .enum(['low', 'medium', 'high', 'critical'])
        .default('medium'),
    column: z
        .string()
        .default('Backlog'),
    assignee: z
        .string()
        .nullable()
        .optional(),
    dueDate: z
        .string()
        .nullable()
        .optional(),
    projectId: z
        .string()
        .min(1, 'Project ID is required'),
});

const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200)
        .trim()
        .optional(),
    description: z
        .string()
        .max(2000)
        .optional(),
    priority: z
        .enum(['low', 'medium', 'high', 'critical'])
        .optional(),
    column: z
        .string()
        .optional(),
    status: z
        .enum(['backlog', 'inprogress', 'inreview', 'done'])
        .optional(),
    assignee: z
        .string()
        .nullable()
        .optional(),
    dueDate: z
        .string()
        .nullable()
        .optional(),
    isAtRisk: z
        .boolean()
        .optional(),
});

const aiSuggestSchema = z.object({
    taskTitle: z
        .string()
        .min(3, 'Task title must be at least 3 characters')
        .max(200)
        .trim(),
});

const sessionParamSchema = z.object({
    sessionId: z
        .string()
        .min(10, 'Invalid session ID format'),
});

module.exports = {
    registerSchema,
    loginSchema,
    workspaceSchema,
    projectSchema,
    updateProjectSchema,
    createTaskSchema,
    updateTaskSchema,
    aiSuggestSchema,
    sessionParamSchema,
};