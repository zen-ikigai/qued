import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const TaskCard = ({ task, handleStatusChange, handleEdit, handleDelete, userId }) => {
//  const { data: session } = useSession();
  // const router = useRouter();

  // Convert due date to a readable format
  
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // remove the delete, edit and status change from here and move then to sortable task.

  return (
    <div className="task_card border border-black m-4 p-4 text-black">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{task.title}</h3>
        
          <div className="flex space-x-2">
            <button onClick={() => handleEdit(task)} className="icon_btn">
              <HiOutlinePencil className="h-5 w-5" />
            </button>
            <button onClick={() => handleDelete(task._id, userId)} className="icon_btn">
              <HiOutlineTrash className="h-5 w-5" />
            </button>
          </div>
        
      </div>
      <p className="text-sm text-gray-600 mt-2">{formattedDueDate}</p>
      <p className="text-sm mt-4">{task.description}</p>

      <div className="flex justify-end mt-4">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 text-sm"
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
