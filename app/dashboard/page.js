/**
 * Dashboard component that manages the main user interface for interacting with tasks.
 * It handles task fetching, deletion, editing, and status updates.
 * This component is protected by the `withAuth` higher-order component to ensure it's only accessible to authenticated users.
 *
 * @component
 * @example
 * return <Dashboard />
 */

'use client'
import { useEffect, useState } from 'react'
import TabbedMenu from '@/components/TabbedMenu'
import CreateTaskIcon from '@/components/task/CreateTask'
import { useSession } from 'next-auth/react'
import TaskModal from '@/components/task/TaskModal'
import Loading from '@/components/info/Loading'
import withAuth from '@/components/hoc/withAuth'
import Failure from '@/components/info/Failure'

const Dashboard = () => {
  const { data: session, status, update } = useSession()
  const [tasks, setTasks] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [isEditing, setIsEditing] = useState(true)
  const [failureModalFetchTasks, setFailureModalFetchTasks] = useState(false)
  const [failureModalDeleteTask, setFailureModalDeleteTask] = useState(false)
  const [failureModalChangeStatus, setFailureModalChangeStatus] =
    useState(false)

  /**
   * Fetches tasks from the backend API and updates the state.
   * Sets a failure modal if the fetch is unsuccessful.
   */
  const fetchTasks = async () => {
    const response = await fetch(`/api/user/${session?.user.id}/gettasks`, {
      method: 'GET',
    })
    if (response.ok) {
      const data = await response.json()
      setTasks(data)
    } else {
      setFailureModalFetchTasks(true)
    }
  }

  /**
   * Effect hook to fetch tasks when a session is established.
   */
  useEffect(() => {
    if (session?.user) {
      fetchTasks()
    }
  }, [session])

  /**
   * Handles deletion of a task. Updates the task list optimistically and reverts if the deletion fails.
   * @param {string} taskId - ID of the task to delete.
   * @param {string} userId - ID of the user performing the deletion.
   */
  const handleDelete = async (taskId, userId) => {
    const removedTask = tasks.find(task => task._id === taskId)
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))

    try {
      const response = await fetch(
        `/api/task/${taskId}/deletetask?userId=${userId}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        setFailureModalDeleteTask(true)
        update()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      setTasks(prevTasks => [...prevTasks, removedTask])
      setFailureModalDeleteTask(true)
      update()
    }
  }

  /**
   * Opens the modal for editing a task.
   * @param {object} task - Task object to edit.
   */
  const handleEdit = task => {
    setCurrentTask(task)
    setIsEditModalOpen(true)
  }

  /**
   * Handles status updates for tasks. Optimistically updates the task status and reverts if the update fails.
   * @param {string} taskId - ID of the task to update.
   * @param {string} newStatus - New status for the task.
   */
  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task,
      ),
    )

    try {
      const response = await fetch(
        `/api/task/${taskId}/changestatus?userId=${session?.user.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      )

      if (!response.ok) {
        setFailureModalChangeStatus(true)
        update()
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: task.status } : task,
        ),
      )
      setFailureModalChangeStatus(true)
      update()
    }
  }

  return (
    <section className='min-w-[90vw]'>
      <TabbedMenu
        tasks={tasks}
        setTasks={setTasks}
        userId={session?.user.id}
        fetchTasks={fetchTasks}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleStatusChange={handleStatusChange}
      />
      <CreateTaskIcon fetchTasks={fetchTasks} />
      {isEditModalOpen && (
        <TaskModal
          buttonName='Edit Task'
          heading='Edit Task'
          handleModal={() => setIsEditModalOpen(false)}
          apiEndpoint={`/api/task/${currentTask._id}/edittask?userId=${session?.user.id}`}
          isEditing={isEditing}
          fetchTasks={fetchTasks}
          taskToEdit={currentTask}
        />
      )}
      {failureModalFetchTasks && (
        <Failure
          title='Failed'
          message='Failed to fetch tasks.'
          onClose={() => setFailureModalFetchTasks(false)}
        />
      )}
      {failureModalDeleteTask && (
        <Failure
          title='Failed'
          message='Failed to delete task. Reverting Back!'
          onClose={() => setFailureModalDeleteTask(false)}
        />
      )}
      {failureModalChangeStatus && (
        <Failure
          title='Failed'
          message='Failed to change Status. Reverting back!'
          onClose={() => setFailureModalChangeStatus(false)}
        />
      )}
    </section>
  )
}

export default withAuth(Dashboard)
