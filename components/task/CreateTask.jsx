import React, { useState } from 'react';
import { HiOutlinePencilAlt, HiPencil, HiPlusCircle } from 'react-icons/hi';
import TaskModal from './TaskModal';
import { useSession } from 'next-auth/react';

const CreateTaskIcon = ({ fetchTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data:session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  

  return (
    <div>
      {/* Pencil Icon */}
      <div className="create-task-icon sm:flex hidden" onClick={toggleModal}>
        <HiPlusCircle className='w-10 h-10'/>
      </div>
      <div className="create-task-icon-mobile sm:hidden" onClick={toggleModal}>
        <HiPlusCircle className='w-8 h-8'/>
      </div>

      {/* New Task Modal */}
      {isModalOpen && <TaskModal 
      buttonName='Create Task' 
      heading='Create Task' 
      handleModal={toggleModal} 
      apiEndpoint={`/api/user/${session?.user.id}/addtask/`} 
      isEditing={isEditing}
      fetchTasks={fetchTasks}

      />}
    </div>
  );
};

export default CreateTaskIcon;
