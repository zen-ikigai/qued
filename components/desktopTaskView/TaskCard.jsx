const TaskCard = ({ task }) => {
  
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedCreationDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  

  return (
    <div className=" border-b border-black p-4 text-black ">
      
      <div >
        <h3 className="text-xl font-bold">{task.title}</h3>        
        <p className="text-lg mt-2 border-b border-gray-400 pb-3">{task.description}</p>
      </div>      
      <div>
        <p className="text-sm text-gray-600 mt-3"><b>Created on: </b>{formattedCreationDate}</p>
        <p className="text-sm text-gray-600 mt-2"><b>Due By: </b>{formattedDueDate}</p>
      </div>
    </div>
  );
};

export default TaskCard;
