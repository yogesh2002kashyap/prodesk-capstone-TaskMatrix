import { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { suggestSubtasks } from '../../services/aiService';

const COLUMNS = ['Backlog', 'In Progress', 'In Review', 'Done'];

export default function TaskModal({onClose}){
    const {addTask} = useWorkspace();
    const [form, setForm] = useState({
            title: '',
            description: '',
            priority: 'medium',
            column:'Backlog',
    });
    const [loading,setLoading] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [suggesting, setSuggesting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;

        setLoading(true);
        try{
            await addTask(form);
            onClose();
        }catch(err){
            console.error('Failed to create task', err);
        }finally{
            setLoading(false);
        }
    };

    const handleSuggest = async () => {
        if(!form.title.trim()) return;
        setSuggesting(true);
        try{
            const subtasks = await suggestSubtasks(form.title);
            setSuggestions(subtasks);
        }catch(err){
            console.error('AI suggestion failed', err);
        }finally{
            setSuggesting(false);
        }
    };

    

    return (
        <div className='fixed inset-0 bg-brand-dark/30 flex items-center justify-center z-50'>
            <div className='bg-white rounded-md shadow-lg p-6 w-full max-w-sm'>
                <h2 className='text-sm font-medium text-gray-900 mb-4'>
                 New Task
                </h2>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <label className='block text-xs text-gray-400 mb-1'>
                        Title
                        </label>
                        <input type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value})}
                        placeholder='Task Title'
                        className='w-full border border-gray-100 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400' />
                    </div>
                    {form.title.trim().length > 2 && (
                        <div>
                            <button type='button' onClick={handleSuggest}
                                    disabled={suggesting} 
                                    className="text-xs text-blue-800 hover:underline disabled:opacity-50">
                                {suggesting ? 'Generating...' : '✦ Suggest subtasks'}
                            </button>
                            {suggestions.length > 0 && (
                                <ul className='mt-2 space-y-1'> 
                                    {suggestions.map((s,i) => (
                                        <li key={i} className="text-xs text-gray-800 bg-gray-50 rounded-md px-3 py-1.5 border border-gray-100">
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <textarea 
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className='w-full border border-gray-100 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
                            rows={3}
                            placeholder='Optional'/>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Priority</label>
                        <select value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="w-full border border-gray-100 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Column</label>
                        <select value={form.column} 
                        onChange={(e) => setForm({ ...form, column: e.target.value })}
                        className='w-full border border-gray-100 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400'
                        >
                            {COLUMNS.map((col) => (
                                <option key={col} value={col} >{col}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex gap-2 pt-2'>
                        <button type='button' onClick={onClose} className='flex-1 px-3 py-2 border border-gray-100 text-xs rounded-md text-gray-800 hover:bg-gray-50 transition'
                        >
                            Cancel
                        </button>
                        <button type='submit' disabled={loading} 
                        className='flex-1 px-3 py-2 bg-brand-dark text-gray-50 text-xs rounded-md hover:bg-gray-900 transition disabled:opacity-50'
                        >
                            {loading? 'Creating...':'Create task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}