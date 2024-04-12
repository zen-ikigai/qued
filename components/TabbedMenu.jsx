import React, { useState, useEffect } from 'react';
import TaskBoard from './desktopTaskView/TaskBoard';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HiCalendar } from 'react-icons/hi';

const TabbedMenu = ({ tasks, setTasks, userId, fetchTasks, handleDelete, handleEdit, handleStatusChange }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlClearSearch = () => {
    setSearchQuery('');
  };

  // Helper function to filter tasks based on the tab and search query
  const filterTasks = (tab) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to 00:00:00

    let filteredTasks = tasks;

    switch (tab) {
      case 'today':
        filteredTasks = filteredTasks.filter((task) => new Date(task.dueDate).toDateString() === now.toDateString());
        break;
      case 'all':
        break; 
      case 'overdue':
        filteredTasks = filteredTasks.filter((task) => new Date(task.dueDate) < now);
        break;
      case 'calendar':
        filteredTasks = filteredTasks.filter((task) => new Date(task.dueDate).toDateString() === selectedDate.toDateString());
        break;
      default:
        break; // No additional filtering
    }

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTasks;
  };

  return (
    <div className='border border-black'>
      <div className="tabs">
        {['today', 'all', 'overdue', 'calendar'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'today' && "Today"}
            {tab === 'all' && "All"}
            {tab === 'overdue' && "Overdue"}
            {tab === 'calendar' && <HiCalendar className='w-5 h-5'/>}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className='flex items-center justify-center'>
        <form className="relative w-11/12  mt-5  items-center justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks by Title or Description..."
            className="search_input"
          />
          {searchQuery && (
            <button
            type="button"
            className="absolute right-2 top-0 mt-2 mr-2"
            onClick={handlClearSearch}
            >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </form>
      </div>

      <div className="tab-content">
        {activeTab === 'calendar' && (
          <div className='mb-5 flex items-center justify-center'>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        )}
        <TaskBoard tasks={filterTasks(activeTab)} setTasks={setTasks} userId={userId} fetchTasks={fetchTasks} handleDelete={handleDelete} handleEdit={handleEdit} handleStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default TabbedMenu;
