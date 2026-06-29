import TaskCard from './TaskCard';

const COLUMN_DOT = {
  'Backlog':     'bg-col-backlog',
  'In Progress': 'bg-col-inprogress',
  'In Review':   'bg-col-inreview',
  'Done':        'bg-col-done',
};

export default function KanbanColumn({ column, tasks, onMove, onDelete, onAddTask, allColumns}){
    return (
        <div className='min-w-[220px] w-[220px] flex flex-col gap-2'>
            <div className='flex items-center gap-2 mb-1'>
                <div className={`w-2 h-2 rounded-full ${COLUMN_DOT[column]}`}>
                    <span className='text-xs font-medium text-gray-400'>{column}</span>
                    <span className='ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full'>{tasks.length}</span>
                </div>

                {tasks.map((task) => (
                    <TaskCard
                    key={task._id}
                    task={task}
                    column={column}
                    allColumns={allColumns}
                    onMove={onMove}
                    onDelete={onDelete}/>
                ))}

                {tasks.length === 0 && (
                    <div className='border border-dashed border-gray-100 rounded-md p-4 text-center'>
                        <p className='text-[10px] text-gray-400'>
                        No tasks
                        </p>
                    </div>
                )}

                <button onClick={onAddTask}
                    className='text-left text-xs text-gray-400 hover:text-gray-800 px-1 py-2 transition'>+ Add task</button>
            </div>
        </div>
    );
}