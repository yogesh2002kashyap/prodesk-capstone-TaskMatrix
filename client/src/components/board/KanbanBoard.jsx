import { useWorkspace} from '../../context/WorkspaceContext'
import KanbanColumn from './KanbanColumn'

const COLUMNS = ['Backlog', 'In Progress', 'In Review', 'Done'];

export default function KanbanBoard({onAddTask}){
    const { tasks, moveTask, removeTask, selectedProject } = useWorkspace();
    
    if(!selectedProject){
        return (
            <div className='flex-1 flex items-center justify-center'>
                <p className='text-sm text-gray-400'>
                    select or create a project to get started
                </p>
            </div>
        );
    }

    return (
        <div className='flex gap-4 p-6 overflow-x-auto flex-1'>
            {COLUMNS.map((column) => (
                <KanbanColumn key={column}
                column={column}
                tasks={tasks.filter((t)=> t.column === column)}
                onMove={moveTask}
                onDelete={removeTask}
                onAddTask={onAddTask}
                allColumns={COLUMNS}/>
            ))

            }

        </div>
    );
}