import React, { useState } from 'react';
import TaskBoard from './desktopTaskView/TaskBoard';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styling, you can customize it
import { HiCalendar } from 'react-icons/hi';

const TabbedMenu = ({ tasks, setTasks, userId, fetchTasks, handleDelete, handleEdit }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Helper function to filter tasks based on the tab
  const filterTasks = (tab) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to 00:00:00

    switch (tab) {
      case 'today':
        return tasks.filter((task) => new Date(task.dueDate).toDateString() === now.toDateString());
      case 'all':
        return tasks;
      case 'overdue':
        return tasks.filter((task) => new Date(task.dueDate) < now);
      case 'calendar':
        // For tasks on the selected date in the calendar
        return tasks.filter((task) => new Date(task.dueDate).toDateString() === selectedDate.toDateString());
      default:
        return [];
    }
  };

  
  
  return (
    <div>
      {/* Tab Headers */}
      <div className="tabs">
        {['today', 'all', 'overdue', 'calendar'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'today' && "Today's Task"}
            {tab === 'all' && "All Tasks"}
            {tab === 'overdue' && "Overdue Tasks"}
            {tab === 'calendar' && <HiCalendar className='w-5 h-5'/>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'calendar' && (
          <div className='mb-5'>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        )}
        {/* Always render TaskBoard but pass filtered tasks based on activeTab and selectedDate for 'calendar' */}
        <TaskBoard tasks={filterTasks(activeTab)} setTasks={setTasks} userId={userId} fetchTasks={fetchTasks} handleDelete={handleDelete} handleEdit={handleEdit} />
      </div>

      <div className="tabs block sm:hidden">
        {['today', 'all', 'overdue', 'calendar'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'today' && "Today's Task"}
            {tab === 'all' && "All Tasks"}
            {tab === 'overdue' && "Overdue Tasks"}
            {tab === 'calendar' && <HiCalendar className='w-5 h-5'/>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabbedMenu;
