'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const TaskModal = ({ fetchTasks, handleModal, apiEndpoint, buttonName, heading, isEditing, taskToEdit }) => {
  const { data:session, status, update } = useSession();

  const [task, setTask] = useState(() => {
    if(isEditing) {
      return {
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate, 
        reminder: taskToEdit.reminder || false,
      } 
  }
  else {
    return {
      title: '',
      description: '',
      status: 'todo',
      dueDate: '',
      reminder: false,
    } 
  }  
});

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  if (type === 'checkbox') {
    setTask({ ...task, [name]: checked });
  } else {
    setTask({ ...task, [name]: value });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();   

    try {
        if (isEditing) {
          const response = await fetch(apiEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
          });

          if (!response.ok) {
              throw new Error('Failed to create task');
          }

          const newTask = await response.json();
          console.log('Task created successfully');
        }
        else {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
          });
          
          if (!response.ok) {
              throw new Error('Failed to create task');
          }

          const newTask = await response.json();
          console.log('Task created successfully');

          handleModal(); 
          update();
        }

        if (!isEditing) {
          fetchTasks();
        }
        update();
        handleModal();
        setTask({
          title: '',
          description: '',
          status: 'todo',
          dueDate: '',
          reminder: false,
        })

    } catch (error) {
        console.error('Error creating task:', error);
        
    }
};


  return (
    <div className="modal-backdrop font-mono ">
      <div className="modal bg-blue-100 border border-black">
        <h2 className='text-3xl font-bold text-center'>{heading}</h2>
        <form onSubmit={handleSubmit} className='p-5'>
          <label>Title</label>
          <input type="text" name="title" value={task.title} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={task.description} onChange={handleChange} required />

          <div className='flex items-center justify-between mt-5'>
            <div>
              <label className='mr-5'>Status</label>
              <select name="status" value={task.status} onChange={handleChange} required>
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

           <div>
            <label className='mr-5'>Due Date</label>
              <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} required/>
            </div>
           </div>

          <div className='items-center justify-center mt-5'>
          <input type="checkbox" name="reminder" checked={task.reminder} onChange={handleChange} className='mr-2' />
            <label>Set Reminder</label>            
          </div>


         <div className='flex items-center justify-center mt-5 gap-5'>
         <button type="submit" className='black_btn_mono'>{buttonName}</button>
          <button type="button" className='outline_btn_mono' onClick={handleModal}>Cancel</button>
         </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
