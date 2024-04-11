import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDndMonitor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

export function SortableTask({ id, task, handleDelete, userId, handleEdit }) {
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
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} handleDelete={handleDelete} userId={userId} handleEdit={handleEdit} />
    </div>
  );
}
