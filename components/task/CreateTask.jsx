import React, { useState } from 'react'
import { HiPlusCircle } from 'react-icons/hi'
import TaskModal from './TaskModal'
import { useSession } from 'next-auth/react'

/**
 * A component that provides an interactive icon to open a modal for creating a new task.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.fetchTasks - Function to fetch tasks after creation.
 * @returns {React.Element} The rendered component with an icon and a modal for task creation.
 */
const CreateTaskIcon = ({ fetchTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  /**
   * Toggles the visibility of the task creation modal.
   */
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div>
      {/* Icon for opening the task creation modal */}
      <div className='create-task-icon sm:flex hidden' onClick={toggleModal}>
        <HiPlusCircle className='w-10 h-10' />
      </div>
      <div className='create-task-icon-mobile sm:hidden' onClick={toggleModal}>
        <HiPlusCircle className='w-8 h-8' />
      </div>

      {/* Task Modal for creating a new task */}
      {isModalOpen && (
        <TaskModal
          buttonName='Create Task'
          heading='Create Task'
          handleModal={toggleModal}
          apiEndpoint={`/api/user/${session?.user.id}/addtask/`}
          isEditing={isEditing}
          fetchTasks={fetchTasks}
        />
      )}
    </div>
  )
}

export default CreateTaskIcon
