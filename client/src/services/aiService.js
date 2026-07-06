import api from './api';

export const suggestSubtasks = async (taskTitle) => {
    const res = await api.post('/ai/suggest', { taskTitle });
    return res.data.data.subtasks;
};