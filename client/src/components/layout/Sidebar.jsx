import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWorkspace } from '../../context/WorkspaceContext';
import { useState } from "react";


export default function Sidebar(){
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const {workspaces, selectedWorkspace, setSelectedWorkspace, addWorkspace,
    projects, selectedProject, setSelectedProject, addProject,
    } = useWorkspace();

    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [showWSInput, setShowWSInput] = useState(false);
    const [showProjInput, setShowProjInput] = useState(false);

    const navItems = [
        {label:'Board', path:'/board'},
        {label: 'Heatmap', path:'/heatmap'},
    ];

    const handleAddWorkspace = async (e) => {
        e.preventDefault();
        if(!newWorkspaceName.trim()) return;
        await addWorkspace(newWorkspaceName);
        setNewWorkspaceName('');
        setShowWSInput(false);
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        if(!newProjectName.trim()) return;
        await addProject(newProjectName);
        setNewProjectName('');
        setShowProjInput(false);
    };


    return(
        <aside className="w-[188px] min-w-[188px] h-screen bg-white border-r border-gray-100 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-[11px] font-medium text-blue-800">
                    TM
                </div>
                <span className="text-sm font-medium text-grey-900">TaskMatrix</span>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto px-2 py-3 gap-1">
                <div className="px-2 mb-1">
                <select className="w-full test-xs text-gray-800 bg-gray-500 border border-gray-100 rounded-md px-2 py-1.5 focus:outline-none focue:ring-2 focus:ring-blue-400"
                    value={selectedWorkspace?._id || ''}
                    onChange={(e) => {
                        const ws = workspaces.find((w) => w._id === e.target.value);
                    setSelectedWorkspace(ws);
                    }}>
                        {workspaces.map((ws) => (
                          <option key={ws._id} value={ws._id}>{ws.name}</option>
                        ))}
                </select>
                </div>

                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mt-2 mb-2"> 
                    Workspace
                </p>

                {navItems.map((item) => (
                    <button key={item.path} onClick={() => navigate(item.path)} className={`w-full text-left px-3 py-2 rounded-md yext-xs tarnsition ${
                    location.pathname === item.path ? 'bg-gray-50 text-gray-900 font-medium' :'test-gray-400 hover:bg-gray-400 hover:text-gray-800'}`} >{item.label}</button>
                ))
                }

                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mt-4 mb-1">
                    Projects
                </p>

                {
                    projects.map((project) => (
                        <button
                        key={project._id}
                        onClick={() => setSelectedProject(project)}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs transition flex items-center gap-2 ${
                            selectedProject?._id === project._id
                            ? 'bg-gray-50 text-gray-900 font-medium'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                        ><span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                            {project.name}
                        </button>
                    ))
                }

                {showProjInput ? (
                    <form onSubmit={handleAddProject} className="px-2 mt-1 flex gap-1">
                        <input type="text" autoFocus value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}  placeholder="Project name" 
                        className="flex-1 border border-gray-100 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        <button type="submit" className="text-xs text-blue-800 font-medium"> Add</button>
                    </form>
                )
                : ( <button
                onClick={()=> setShowProjInput(true)} className="text-left px-3 py-2 text-xs text-gray-400 hover:text-gray-800 transition">+ New project</button>) }

                { showWSInput ? (
                    <form onSubmit={handleAddWorkspace} className="px-2 mt-1 flex gap-1">
                        <input type="text"
                        autoFocus
                        value={newWorkspaceName}
                        onChange={(e)=> setNewWorkspaceName(e.target.value)}
                        placeholder="Workspace name"
                        className="flex-1 border border-gray-100 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button type="submit" className="text-xs text-blue-800 font-medium">Add</button>
                    </form> 
                ): (
                    <button onClick={setShowWSInput(true)} className="text-left px-3 py-2 text-xs text-gray-400 hover:text-gray-800 transition">
                        + New workspace
                    </button>
                )}
            </div>

            <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[9px] font-medium text-blue-800 flex-shrink-0">
                {user?.name?.slice(0,2).toUpperCase()}
                </div>
                <span className="text-xs text-gray-800 truncate flex-1">{user?.name}</span>
                <button onClick={logout} className="text-[10px] text-gray-400 hover:text-gray-800 transition">Out</button>
            </div>
        </aside>
    );
}