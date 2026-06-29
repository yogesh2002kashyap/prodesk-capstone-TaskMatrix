import { useWorkspace} from '../../context/WorkspaceContext'

export default function Topbar({onAddTask}){
    const { selectedProject } = useWorkspace();

    return (
        <header className='h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0'>
            <div>
                <p className='text-sm font-medium text-gray-900'>
                {selectedProject?.name || 'Select a project'}
                </p>
                <p className='text-[10px] text-gray-400'>Sprint 1 · Jun 10 – Jun 24</p>
            </div>
            <div className='ml-auto flex items-center gap-3'>
                <button className='px-3 py-1.5 border border-gray-100 text-xs text-gray-400 rounded-md hover:bg-gray-50 transition'>
                    Filter
                </button>
                <button className='px-3 py-1.5 bg-brand-dark text-gray-50 text-xs rounded-md hover:bg-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed'
                onClick={onAddTask}
                disabled={!selectedProject}>
                        + Add task
                </button>
            </div>
        </header>
    );
}