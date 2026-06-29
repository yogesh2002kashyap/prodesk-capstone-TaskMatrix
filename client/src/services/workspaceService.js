import api from './api';

export const createWorkspace = (data) => api.post('/workspaces', data);
export const getWorkspaces = () => api.get('/workspaces');
export const updateWorkspace = (id, data) => api.put(`/workspaces/${id}`, data);
export const deleteWorkspace = (id) => api.delete(`/workspaces/${id}`);