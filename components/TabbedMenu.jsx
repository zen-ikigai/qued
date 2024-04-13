import React, { useState, useEffect } from 'react'
import TaskBoard from './desktopTaskView/TaskBoard'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { HiCalendar } from 'react-icons/hi'

/**
 * Component that manages the task viewing experience, including filtering,
 * sorting, and task management actions within different views like "All", "Today",
 * "Overdue", and "Calendar".
 *
 * @param {Object} props - Component props.
 * @param {Array} props.tasks - List of tasks to be managed.
 * @param {Function} props.setTasks - Function to update the list of tasks.
 * @param {string} props.userId - ID of the current user.
 * @param {Function} props.fetchTasks - Function to fetch tasks from the backend.
 * @param {Function} props.handleDelete - Function to handle the deletion of a task.
 * @param {Function} props.handleEdit - Function to handle editing of a task.
 * @param {Function} props.handleStatusChange - Function to handle changes in task status.
 * @returns {React.Element} The rendered component.
 */

const TabbedMenu = ({
  tasks,
  setTasks,
  userId,
  fetchTasks,
  handleDelete,
  handleEdit,
  handleStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('creationDesc')

  const handleSearchChange = e => {
    setSearchQuery(e.target.value)
  }

  const handlClearSearch = () => {
    setSearchQuery('')
  }

  const handleSortChange = e => {
    setSortOrder(e.target.value)
  }

  // Helper function to filter tasks based on the tab, search query and sort order
  const filterTasks = tab => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Set time to 00:00:00

    let filteredTasks = tasks

    switch (tab) {
      case 'all':
        break
      case 'today':
        filteredTasks = filteredTasks.filter(
          task => new Date(task.dueDate).toDateString() === now.toDateString(),
        )
        break
      case 'overdue':
        filteredTasks = filteredTasks.filter(
          task => new Date(task.dueDate) < now && task.status !== 'done',
        )
        break
      case 'calendar':
        filteredTasks = filteredTasks.filter(
          task =>
            new Date(task.dueDate).toDateString() ===
            selectedDate.toDateString(),
        )
        break
      default:
        break
    }

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(
        task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    filteredTasks = [...filteredTasks].sort((a, b) => {
      switch (sortOrder) {
        case 'creationDesc':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'creationAsc':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'dueDesc':
          return new Date(b.dueDate) - new Date(a.dueDate)
        case 'dueAsc':
          return new Date(a.dueDate) - new Date(b.dueDate)
        default:
          return 0
      }
    })

    return filteredTasks
  }

  return (
    <div className='border border-black shadow-lg'>
      <div className='tabs '>
        {['all', 'today', 'overdue', 'calendar'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' && 'All'}
            {tab === 'today' && 'Today'}
            {tab === 'overdue' && 'Overdue'}
            {tab === 'calendar' && <HiCalendar className='w-5 h-5' />}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className='flex sm:flex-row flex-col gap-5 items-center justify-center mt-7'>
        <form className='relative sm:w-3/4 items-center justify-center'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder='Search tasks by Title or Description...'
            className='search_input'
          />
          {searchQuery && (
            <button
              type='button'
              className='absolute right-2 top-0 mt-2 mr-2'
              onClick={handlClearSearch}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-gray-500 hover:text-gray-700'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </form>
        <select onChange={handleSortChange} className='w-1/6 sort_input'>
          <option value='creationDesc'>Sort: Newest First</option>
          <option value='creationAsc'>Sort: Oldest First</option>
          <option value='dueDesc'>Sort: Due Date (Desc)</option>
          <option value='dueAsc'>Sort: Due Date (Asc)</option>
        </select>
      </div>

      <div className='tab-content mt-2'>
        {activeTab === 'calendar' && (
          <div className='mb-5 flex items-center justify-center'>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        )}
        <TaskBoard
          tasks={filterTasks(activeTab)}
          setTasks={setTasks}
          userId={userId}
          fetchTasks={fetchTasks}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleStatusChange={handleStatusChange}
        />
      </div>
      <div className='tabs-bottom '>
        {['calendar', 'all', 'today', 'overdue'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'calendar' && <HiCalendar className='w-5 h-5' />}
            {tab === 'all' && 'All'}
            {tab === 'today' && 'Today'}
            {tab === 'overdue' && 'Overdue'}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TabbedMenu
