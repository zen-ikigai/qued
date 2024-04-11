'use client'
import { useEffect, useState } from "react";
import TabbedMenu from "@/components/TabbedMenu";
import CreateTaskIcon from "@/components/task/CreateTask";
import { useSession } from "next-auth/react";
import TaskModal from "@/components/task/TaskModal";
import Loading from "@/components/info/Loading";

const Dashboard = () => {
    const { data: session, status, update } = useSession();
    const [tasks, setTasks] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isEditing, setIsEditing] = useState(true);

    
    const fetchTasks = async () => {
      const response = await fetch(`/api/user/${session?.user.id}/gettasks`, {
        method: 'GET'
      });
      const data = await response.json()
      setTasks(data);
    };

    
    useEffect(() => {
      if (session?.user) {
        fetchTasks();
      }
    }, [session]);

    if (status === "loading" || !session ) {
      return (
        <Loading />
      )
    }
    
    const handleDelete = async (taskId, userId) => {
      
      const removedTask = tasks.find(task => task._id === taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    
      try {
        const response = await fetch(`/api/task/${taskId}/deletetask?userId=${userId}`, {
          method: 'DELETE',
        });
    
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        
      } catch (error) {
        console.error('Error deleting task:', error);
        // Revert the UI back to its previous state by adding the removed task back
        setTasks(prevTasks => [...prevTasks, removedTask]);
      }
    };
    
    const handleEdit = (task) => {
      setCurrentTask(task); // Set the task to be edited
      setIsEditModalOpen(true);  // Open the modal
    };

    
    const handleStatusChange = async (taskId, newStatus) => {
      
      setTasks(prevTasks =>
        prevTasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task)
      );

      try {
        // API call to update the status in the backend
        const response = await fetch(`/api/task/${taskId}/changestatus?userId=${session?.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task status');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        // Rollback to previous state in case of an error
        setTasks(prevTasks =>
          prevTasks.map(task => task._id === taskId ? { ...task, status: task.status } : task)
        );
      }
    };

    

  return (
    <section className="min-w-[90vw]">
    
        <TabbedMenu tasks={tasks} setTasks={setTasks} 
        userId={session?.user.id} fetchTasks={fetchTasks} 
        handleDelete={handleDelete} handleEdit={handleEdit}
        handleStatusChange={handleStatusChange}

        />
        <CreateTaskIcon fetchTasks={fetchTasks} />
        {isEditModalOpen && <TaskModal 
          buttonName='Edit Task' 
          heading='Edit Task' 
          handleModal={() => setIsEditModalOpen(false)} 
          apiEndpoint={`/api/task/${currentTask._id}/edittask?userId=${session?.user.id}`} 
          isEditing={isEditing}
          fetchTasks={fetchTasks}
          taskToEdit={currentTask}

          />}
    </section>
  )
}

export default Dashboard