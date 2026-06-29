import {  useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import KanbanBoard from '../components/board/KanbanBoard';
import TaskModal from '../components/modals/TaskModal';

export default function KanbanPage(){
    const[showModal, setShowModal] = useState(false);

    return(
        <div className='flex h-screen overflow-hidden bg-brand-bg'>
            <Sidebar />
            <div className='flex flex-col flex-1 overflow-hidden'>
                <Topbar onAddTask={() => setShowModal(true)} />
                    <KanbanBoard onAddTask={() => setShowModal(true)} />
            </div>
            {showModal && <TaskModal onClose={() => setShowModal(false)} />}
        </div>
    )
}