import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const TaskCard = ({ task }) => {
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
    <div className=" border-b border-black p-4 text-black ">
      
      <div>
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{formattedDueDate}</p>
        <p className="text-sm mt-4">{task.description}</p>
      </div>      
    </div>
  );
};

export default TaskCard;
