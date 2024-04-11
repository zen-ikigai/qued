'use client'
import { useEffect, useState } from "react";
import TabbedMenu from "@/components/TabbedMenu";
import CreateTaskIcon from "@/components/task/CreateTask";
import { useSession } from "next-auth/react";
import TaskModal from "@/components/task/TaskModal";

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

    const handleDelete = async (taskId, userId) => {    
      try {
        console.log('Calling Delete Function')
        const response = await fetch(`/api/task/${taskId}/deletetask?userId=${userId}`, {
          method: 'DELETE',
        });
    
        if (!response.ok) {
          throw new Error('Failed to delete task');
        } else{
          console.log('deleted successfully')
        }

        fetchTasks();
        update(); 
      } catch (error) {
        console.error('Error deleting task:', error);
        
      }
    };
    const handleEdit = (task) => {
      setCurrentTask(task); // Set the task to be edited
      setIsEditModalOpen(true);  // Open the modal
    };

  return (
    <section className="min-w-[90vw]">
        <TabbedMenu tasks={tasks} setTasks={setTasks} userId={session?.user.id} fetchTasks={fetchTasks} handleDelete={handleDelete} handleEdit={handleEdit}/>
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