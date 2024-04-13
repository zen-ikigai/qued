'use client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Failure from '../info/Failure'
/**
 * Formats a JavaScript Date object into a datetime-local input friendly format.
 *
 * @param {Date} date - The date object to format.
 * @returns {string} - The formatted date string.
 */
const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  // Format the date and time in local timezone
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0') // Convert month to 2-digits
  const day = d.getDate().toString().padStart(2, '0') // Convert day to 2-digits
  const hours = d.getHours().toString().padStart(2, '0') // Convert hours to 2-digits
  const minutes = d.getMinutes().toString().padStart(2, '0') // Convert minutes to 2-digits
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * A modal component for creating or editing tasks.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.fetchTasks - Function to refresh the tasks list upon successful submission.
 * @param {Function} props.handleModal - Function to toggle the visibility of the modal.
 * @param {string} props.apiEndpoint - API endpoint for submitting the task data.
 * @param {string} props.buttonName - Name to display on the submission button.
 * @param {string} props.heading - Text to display as the modal's heading.
 * @param {boolean} props.isEditing - Indicates if the modal is used for editing an existing task.
 * @param {Object} props.taskToEdit - The task data that is being edited, if applicable.
 * @returns {React.Element} - The rendered component.
 */

const TaskModal = ({
  fetchTasks,
  handleModal,
  apiEndpoint,
  buttonName,
  heading,
  isEditing,
  taskToEdit,
}) => {
  const { data: session, status, update } = useSession()
  const [failureModalCreateTask, setFailureModalCreateTask] = useState(false)

  const [task, setTask] = useState(() => {
    if (isEditing) {
      return {
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        dueDate: formatDate(taskToEdit.dueDate),
        reminder: taskToEdit.reminder || false,
      }
    } else {
      // Set initial due date to current date and time, formatted for datetime-local
      const today = formatDate(new Date()) // Use local time formatted string
      return {
        title: '',
        description: '',
        status: 'todo',
        dueDate: today,
        reminder: false,
      }
    }
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setTask({ ...task, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!task.title || !task.description || !task.status) {
      alert('Please fill in all required fields.')
      return
    }

    try {
      // Conditional handling based on whether the task is being edited or created
      const method = isEditing ? 'PATCH' : 'POST'
      const response = await fetch(apiEndpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (response.ok) {
        const newTask = await response.json()

        handleModal()
        update()
        fetchTasks()
        const today = formatDate(new Date())
        setTask({
          title: '',
          description: '',
          status: 'todo',
          dueDate: today,
          reminder: false,
        })
      } else {
        setFailureModalCreateTask(true)
        update()
      }
    } catch (error) {
      console.error('Error processing task:', error)
    }
  }

  return (
    <div className='modal-backdrop font-mono '>
      <div className='modal bg-blue-100 border border-black rounded shadow-2xl'>
        <h2 className='text-3xl font-bold text-center'>{heading}</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type='text'
            name='title'
            value={task.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name='description'
            value={task.description}
            onChange={handleChange}
            required
          />

          <label className='mr-2'>Due Date</label>
          <input
            type='datetime-local'
            name='dueDate'
            value={task.dueDate}
            onChange={handleChange}
            required
            className='p-2'
          />

          <label className='mr-2'>Status</label>
          <select
            name='status'
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value='todo'>To Do</option>
            <option value='inProgress'>In Progress</option>
            <option value='done'>Done</option>
          </select>

          <div className='items-center justify-center mt-5'>
            <input
              type='checkbox'
              name='reminder'
              checked={task.reminder}
              onChange={handleChange}
              className='mr-2'
              disabled
            />
            <label>Set Reminder</label>
          </div>

          <div className='flex items-center justify-center mt-5 gap-5'>
            <button type='submit' className='black_btn_mono'>
              {buttonName}
            </button>
            <button
              type='button'
              className='outline_btn_mono'
              onClick={handleModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {failureModalCreateTask && (
        <Failure
          title='Failed'
          message='Failed to create/edit Task.'
          onClose={() => setFailureModalCreateTask(false)}
        />
      )}
    </div>
  )
}

export default TaskModal
