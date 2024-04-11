'use client'
import TaskCard from "@/components/desktopTaskView/TaskCard";
import TaskBoard from "@/components/desktopTaskView/TaskBoard";
import { useState } from 'react'; // Ensure useState is imported

export default function Home() {


  const [tasks, setTasks] = useState([
    {
    id: '1',
    title: 'Design the TaskCard component',
    description: 'Create a reusable TaskCard component for displaying individual tasks.',
    dueDate: new Date().toISOString(), // Use the current date for simplicity
    status: 'inProgress', // Assume this task is currently in progress
  },

  {
    id: '2',
    title: 'Design the TaskCard component',
    description: 'Create a reusable TaskCard component for displaying individual tasks.',
    dueDate: new Date().toISOString(), // Use the current date for simplicity
    status: 'done', // Assume this task is currently in progress
  },

  {
    id: '3',
    title: 'Design the TaskCard component',
    description: 'Create a reusable TaskCard component for displaying individual tasks.',
    dueDate: new Date().toISOString(), // Use the current date for simplicity
    status: 'todo', // Assume this task is currently in progress
  },
  {
    id: '4',
    title: 'Design the TaskCard component',
    description: 'Create a reusable TaskCard component for displaying individual tasks.',
    dueDate: new Date().toISOString(), // Use the current date for simplicity
    status: 'done', // Assume this task is currently in progress
  },
  


]);
  const handleUpdateStatus = (taskId, newStatus) => {
    console.log(`Task ${taskId} status updated to ${newStatus}. Implement this functionality.`);
  };
  
  const handleEditTask = (task) => {
    console.log(`Editing task ${task.id}. Implement this functionality.`);
  };
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistically update the task status in the local state
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      // Send the status update to the backend
      const response = await updateTaskStatus(taskId, newStatus); // Implement this function to update the task in your backend
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // If necessary, update the task in state based on the response
      // For example, if the backend sends back the updated task, you might want to update it in your local state
    } catch (error) {
      console.error(error);

      // In case of an error, revert to the previous state
      setTasks(tasks);
      alert('Could not update the task status. Please try again.');
    }
  };
  
  return (
    <div className="flex h-screen">
     
       {/*<TaskCard
        task={dummyTask}
        onUpdateStatus={handleUpdateStatus}
        onEdit={handleEditTask}
      />*/}
      {/*<TaskBoard tasks={tasks} onStatusChange={handleStatusChange} /> */}
    </div>
  );
}
