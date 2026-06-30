import api from './api';

export const createTask = (data) => api.post('/tasks',data);
export const getTasks = (projectId) = api.get(`/tasks?projectId=${projectId}`);
export const updateTask = (id,data) => api.put(`/tasks/${id}`,data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);