import { createContext, useContext, useEffect, useState } from 'react';
import { createWorkspace, getWorkspaces } from '../services/workspaceService';
import { createProject, getProjects } from '../services/projectService';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load workspaces
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getWorkspaces();
        const workspaces = res.data.data;

        setWorkspaces(workspaces);

        if (workspaces.length > 0) {
          setSelectedWorkspace(workspaces[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // Load projects
  useEffect(() => {
    if (!selectedWorkspace) {
      setProjects([]);
      setSelectedProject(null);
      setTasks([]);
      return;
    }

    const fetch = async () => {
      try {
        const res = await getProjects(selectedWorkspace._id);
        const projects = res.data.data;

        setProjects(projects);

        if (projects.length > 0) {
          setSelectedProject(projects[0]);
        } else {
          setSelectedProject(null);
          setTasks([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, [selectedWorkspace]);

  // Load tasks
  useEffect(() => {
    if (!selectedProject) return;

    const fetch = async () => {
      try {
        const res = await getTasks(selectedProject._id);
        setTasks(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, [selectedProject]);

  // Add task
  const addTask = async (data) => {
    const res = await createTask({
      ...data,
      projectId: selectedProject._id,
    });

    setTasks((prev) => [...prev, res.data.data]);
  };

  // Move task
  const moveTask = async (taskId, newColumn) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, column: newColumn } : task
      )
    );

    try {
      await updateTask(taskId, { column: newColumn });
    } catch {
      const res = await getTasks(selectedProject._id);
      setTasks(res.data.data);
    }
  };

  // Delete task
  const removeTask = async (taskId) => {
    setTasks((prev) => prev.filter((task) => task._id !== taskId));

    try {
      await deleteTask(taskId);
    } catch {
      const res = await getTasks(selectedProject._id);
      setTasks(res.data.data);
    }
  };

  // Add workspace
  const addWorkspace = async (name) => {
    const res = await createWorkspace({ name });

    setWorkspaces((prev) => [...prev, res.data.data]);
    setSelectedWorkspace(res.data.data);
  };

  // Add project
  const addProject = async (name) => {
    const res = await createProject({
      name,
      workspaceId: selectedWorkspace._id,
    });

    setProjects((prev) => [...prev, res.data.data]);
    setSelectedProject(res.data.data);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        tasks,
        addTask,
        moveTask,
        removeTask,
        addWorkspace,
        addProject,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);