import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { SortableTask } from './SortableTask'
import TaskCard from './TaskCard'

const DroppableArea = ({ id, message }) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className='w-full flex items-center justify-center min-h-full text-base text-gray-600 italic'
    >
      <p>{message}</p>
    </div>
  )
}

const TaskBoard = ({
  tasks,
  setTasks,
  userId,
  fetchTasks,
  handleDelete,
  handleEdit,
  handleStatusChange,
}) => {
  const [containers, setContainers] = useState([
    {
      id: 'todo',
      status: 'todo',
      name: 'To Do',
      bgColor: 'bg-red-100',
      titleColor: 'bg-red-300',
      message: 'No Tasks To Do!',
      tasks: [],
    },
    {
      id: 'inProgress',
      status: 'inProgress',
      name: 'In Progress',
      bgColor: 'bg-yellow-100',
      titleColor: 'bg-yellow-300',
      message: 'No Tasks in Progress!',
      tasks: [],
    },
    {
      id: 'done',
      status: 'done',
      name: 'Done',
      bgColor: 'bg-green-100',
      titleColor: 'bg-green-300',
      message: 'No Tasks Done!',
      tasks: [],
    },
  ])

  const [activeId, setActiveId] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    setContainers(prevContainers =>
      prevContainers.map(container => ({
        ...container,
        tasks: tasks.filter(task => task.status === container.status),
      })),
    )
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = event => {
    const { active } = event
    setActiveId(active.id)
    const item = tasks.find(task => task._id === active.id)
    setDraggedItem(item) // Store the item being dragged for the DragOverlay
  }

  // Finds the container by task ID
  const findContainer = taskId => {
    return containers.find(container =>
      container.tasks.some(task => task._id === taskId),
    )
  }

  // Finds the container by task ID
  const findContainerByTaskId = taskId => {
    return containers.find(container =>
      container.tasks.some(task => task._id === taskId),
    )
  }

  // Finds the container directly by its ID
  const findContainerById = containerId => {
    return containers.find(container => container.id === containerId)
  }

  const handleDragEnd = async event => {
    const { active, over } = event

    if (over) {
      const originalTasks = [...tasks]
      const { id: activeId } = active
      const { id: overId } = over

      const activeContainer = findContainer(activeId)
      let overContainer =
        findContainerByTaskId(overId) || findContainerById(overId)

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer.id === overContainer.id
      )
        return

      const activeTasks = [...activeContainer.tasks]
      const overTasks = [...overContainer.tasks]

      const activeTaskIndex = activeTasks.findIndex(
        task => task._id === activeId,
      )
      const movedTask = {
        ...activeTasks[activeTaskIndex],
        status: overContainer.status,
      }

      activeTasks.splice(activeTaskIndex, 1)
      overTasks.push(movedTask)

      setContainers(
        containers.map(container => {
          if (container.id === activeContainer.id) {
            return { ...container, tasks: activeTasks }
          } else if (container.id === overContainer.id) {
            return { ...container, tasks: overTasks }
          }
          return container
        }),
      )

      try {
        const response = await fetch(
          `/api/task/${movedTask._id}/changestatus?userId=${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: overContainer.status }),
          },
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        // Correct usage of setTasks to update the status of the moved task
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === movedTask._id
              ? { ...task, status: overContainer.status }
              : task,
          ),
        )
        setActiveId(null) // Clear the activeId and draggedItem after drag ends
        setDraggedItem(null)
      } catch (error) {
        console.error('Failed to update task status:', error)
        setTasks(originalTasks)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='flex gap-4 sm:flex-row flex-col sm:min-h-[70vh] min-h-[60vh] font-mono'>
        {containers.map(container => (
          <div
            key={container.id}
            className={`w-full p-4 min-h-[20vh] flex flex-col gap-4 shadow-2xl ${container.bgColor}`}
          >
            <h2
              className={`font-bold text-lg text-center ${container.titleColor} p-2`}
            >
              {container.name}
            </h2>
            <SortableContext
              items={container.tasks.map(task => task._id)}
              strategy={verticalListSortingStrategy}
            >
              {container.tasks.map(task => (
                <SortableTask
                  key={task._id}
                  id={task._id}
                  task={task}
                  handleDelete={handleDelete}
                  userId={userId}
                  handleEdit={handleEdit}
                  handleStatusChange={handleStatusChange}
                />
              ))}
              {container.tasks.length === 0 && (
                <DroppableArea id={container.id} message={container.message} />
              )}
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {draggedItem && <SortableTask task={draggedItem} />}
      </DragOverlay>
    </DndContext>
  )
}

export default TaskBoard
