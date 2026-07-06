import api from './api';

export const suggestSubtasks = async (tasktitle) =>  {
    const res = await api.post('/ai/suggest', {tasktitle});
    return res.data.data.subtasks
};