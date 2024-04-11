import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableTask } from './SortableTask';
import TaskCard from './TaskCard';

const DroppableArea = ({ id }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="min-h-[50px] w-full"></div>;
};

// make droppable area full box width and height

const TaskBoard = ({ tasks, setTasks, userId, fetchTasks, handleDelete, handleEdit }) => {
  const [containers, setContainers] = useState([
    { id: 'todo', status: 'todo', tasks: [] },
    { id: 'inProgress', status: 'inProgress', tasks: [] },
    { id: 'done', status: 'done', tasks: [] },
  ]);
  

  useEffect(() => {
    setContainers(prevContainers => prevContainers.map(container => ({
      ...container,
      tasks: tasks.filter(task => task.status === container.status),
    })));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Finds the container by task ID
  const findContainer = (taskId) => {
    return containers.find(container =>
      container.tasks.some(task => task._id === taskId)
    );
  };

// Finds the container by task ID
const findContainerByTaskId = (taskId) => {
  return containers.find(container =>
    container.tasks.some(task => task._id === taskId)
  );
};

// Finds the container directly by its ID
const findContainerById = (containerId) => {
  return containers.find(container => container.id === containerId);
};

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over) {
      const originalTasks = [...tasks];
      const { id: activeId } = active;
      const { id: overId } = over;

      const activeContainer = findContainer(activeId);
      let overContainer = findContainerByTaskId(overId) || findContainerById(overId);

      if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) return;

      const activeTasks = [...activeContainer.tasks];
      const overTasks = [...overContainer.tasks];

      const activeTaskIndex = activeTasks.findIndex(task => task._id === activeId);
      const movedTask = { ...activeTasks[activeTaskIndex], status: overContainer.status };

      activeTasks.splice(activeTaskIndex, 1);
      overTasks.push(movedTask);

      setContainers(containers.map(container => {
        if (container.id === activeContainer.id) {
          return { ...container, tasks: activeTasks };
        } else if (container.id === overContainer.id) {
          return { ...container, tasks: overTasks };
        }
        return container;
      }));

      try {
        const response = await fetch(`/api/task/${movedTask._id}/changestatus?userId=${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: overContainer.status }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Correct usage of setTasks to update the status of the moved task
        setTasks((prevTasks) => prevTasks.map(task => 
          task._id === movedTask._id ? { ...task, status: overContainer.status } : task
        ));


      } catch (error) {
        console.error('Failed to update task status:', error);
        setTasks(originalTasks);

      }
    }
  };

  
    
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className='flex gap-4 sm:flex-row flex-col sm:min-h-[70vh] min-h-[60vh]'>
        {containers.map((container) => (
          <div key={container.id} className=" w-full bg-gray-100 p-4 min-h-[20vh] ">
            <h2 className="font-bold text-lg">{container.status}</h2>
            <SortableContext items={container.tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
              {container.tasks.map((task) => (
                <React.Fragment key={task._id}>
                  <div className='hidden sm:block '>
                    <SortableTask key={task._id} id={task._id} task={task} handleDelete={handleDelete} userId={userId} handleEdit={handleEdit} />
                  </div>
                  <div className='block sm:hidden'>
                    <TaskCard key={task._id} id={task._id} task={task} handleDelete={handleDelete} userId={userId} handleEdit={handleEdit} />
                  </div>
                </React.Fragment>
              ))}
              {container.tasks.length === 0 && <DroppableArea id={container.id} />}
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;