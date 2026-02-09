import { useState } from "react";
import { Task } from "../hooks/useTasks";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isDark: boolean;
  selectedTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  showArchived?: boolean;
  isFocusMode?: boolean;
}

export function TaskList({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onTogglePin,
  onReorder,
  isDark,
  selectedTaskId,
  onSelectTask,
  isFocusMode = false,
}: TaskListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-2 pb-24">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <TaskItem
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onToggleComplete={onToggleComplete}
            onTogglePin={onTogglePin}
            isDark={isDark}
            isDragging={draggedIndex === index}
            isSelected={selectedTaskId === task.id}
            onSelect={() => onSelectTask(task.id)}
            isFocusMode={isFocusMode}
          />
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-12 text-zinc-600">
          <p className="text-lg">No tasks yet</p>
          <p className="text-sm mt-1">Add one above or scan a list</p>
        </div>
      )}
    </div>
  );
}