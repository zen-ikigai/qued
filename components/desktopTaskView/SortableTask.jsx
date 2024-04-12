import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDndMonitor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
 
export function SortableTask({ id, task, handleDelete, userId, handleEdit, handleStatusChange }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  useDndMonitor({
    onDragStart(event) {
      setIsDragging(event.active.id === id);
    },
    onDragEnd() {
      setIsDragging(false);
    },
    onDragCancel() {
      setIsDragging(false);
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'moving' : 'move',
    opacity: isDragging ? 0 : 1
  };

  return (
   <div className='border border-black shadow-lg font-mono' style={style}>
     <div ref={setNodeRef}  {...attributes} {...listeners} className='hidden sm:block' >
      <TaskCard task={task}  />      
     </div>
     <div  className='block sm:hidden'>
      <TaskCard task={task}  />      
     </div>
    <div className="flex justify-between items-center mb-2 pl-4 pr-4">
        <div className="flex space-x-2 mt-2">
          <button onClick={() => handleEdit(task)} className="icon_btn">
            <HiOutlinePencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(task._id, userId)} className="icon_btn">
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-end mt-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task._id, e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 text-sm"
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
   </div>
  );
}
