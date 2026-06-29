import {  createContext, useContext, useEffect, useState } from "react";
import { createWorkspace, getWorkspaces } from "../services/workspaceService";
import { createProject, getProjects } from "../services/projectService";
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskService";


const WorkspaceContext = createContext();

export const WorkspaceProvider = ({children}) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorksapce] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading,setLoading] = useState(true);

    // Workspaces loading
    useEffect(() => {
      const fetch = async () => {
        try{
            const res = await getWorkspaces();
            setWorkspaces(res.data);

            if(res.data.length > 0){
                setSelectedWorksapce(res.data[0]);
            }
        }catch(e){
            console.error(e);
        }finally{
            setLoading(false);
        }
      };
      fetch();
    }, []);

    // Projects loading
    useEffect(() => {
        if(!selectedWorkspace) return;
        const fetch = async () => {
            try{
                const res = await getProjects(selectedWorkspace._id);
                setProjects(res.data);
                if(res.data.length > 0) {
                    setSelectedProject(res.data[0]);
                }
                else{
                    setSelectedProject(null);
                }
            }catch(e) {
                console.error(e);
            }
        };
        fetch();
    }, [selectedWorkspace]);
    
    // Tasks loading
    useEffect(() => {
        if(!selectedProject) return;
        const fetch = async () => {
            try {
                const res = await getTasks(selectedProject._id)
                setTasks(res.data);
            }catch(e) {
                console.error(e);
            }
        };
        fetch();
    }, [selectedProject]);

    // add task
    const addTask = async (data) => {
        const res = await createTask({...data, projectId: selectedProject._id});
        setTasks((prev) => [...prev, res.data]);
    };

    //move task
    const moveTask = async (taskId, newColumn) => {
        setTasks((prev) => 
        prev.map((t) => (t._id === taskId ? {...t, column:newColumn}:t))
        );
        try{
            await updateTask(taskId, {column:newColumn});
        }catch(error){
            const res = await getTasks(selectedProject._id);
            setTasks(res.data);
        }
    };

    const removeTask = async (taskId) => {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        try{
            await deleteTask(taskId);
        }catch(e){
            const res = await getTasks(selectedProject._id);
            setTasks(res.data);
        }
    };

    // new workspace
    const addWorkspace = async (name) => {
        const res = await createWorkspace({name});
        setWorkspaces((prev) => [...prev,res.data]);
        setSelectedWorksapce(res.data);
    };

    // add project
    const addProject = async (name) => {
        const res = await createProject({name, workspaceId:selectedWorkspace._id});
        setProjects((prev) => [...prev, res.data]);
        setSelectedProject(res.data);
    };

    return(
        <WorkspaceContext.Provider
        value={{workspaces,selectedWorkspace,
         setSelectedWorksapce,projects,
         selectedProject,setProjects,
         setSelectedProject,tasks,addTask,
         moveTask,removeTask,addWorkspace,
         addProject,loading}}>
            {children}
            </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);