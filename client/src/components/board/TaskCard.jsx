import { PRIORITY_STYLES } from '../../utils/priorityStyles';

export default function TaskCard({task, column, allColumns, onMove, onDelete}){
    const colIndex = allColumns.indexOf(column);

    return (
        <div className={`bg-white rounded-md border border-gray-100 p-3 group ${
            column === 'In Progress' ?
            'border-1-2 border-1-col-inprogress rounded-1-none': ''
        }`}>
            <p className='text-xs font-medium text-gray-900 mb-2 leading-snug'> {task.title}</p>
            <div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                <div className='ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition'>
                    {colIndex > 0 && (<button onClick={() => onMove(task._id, allColumns[colIndex - 1])}
                                        className="text-[10px] text-gray-400 hover:text-gray-800 px-1"
                                        title="Move left">←</button>) }
                    {colIndex < allColumns.length - 1 && (
                        <button onClick={() => onMove(task._id, allColumns[colIndex + 1])} className='text-[10px] text-gray-400 hover:text-gray-800 px-1'
                        title='Move right'>→</button>
                    )}
                    <button onClick={() => onDelete(task._id)} 
                        className='text-[10px] text-red-400 hover:text-red-800 px-1' title='Delete'>✕</button>
                </div>
            </div>
        </div>
    );
}