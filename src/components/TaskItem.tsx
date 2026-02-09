import { useState, useEffect, useRef } from "react";
import { Pin, Check, Trash2, GripVertical } from "lucide-react";
import { Task } from "../hooks/useTasks";

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  isDark: boolean;
  isSelected: boolean;
  onSelect: () => void;
  isDragging?: boolean; // FIX: Aggiunto prop mancante
  isFocusMode?: boolean;

}

export function TaskItem({
  task,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onTogglePin,
  isDark,
  isSelected,
  onSelect,
  isDragging = false,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editTarget, setEditTarget] = useState<'title' | 'description'>('title');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      if (editTarget === 'description' && textareaRef.current) {
        textareaRef.current.focus();
      } else if (editTarget === 'title' && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, editTarget]);

  const handleSave = () => {
    onUpdateTask(task.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleTitleClick = () => {
    setEditTarget('title');
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  const handleDescClick = () => {
    if (isEditing) return;
    setEditTarget('description');
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget === inputRef.current || e.relatedTarget === textareaRef.current) {
      return;
    }
    handleSave();
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? isDark 
            ? "bg-zinc-800 border-[#042861] ring-1 ring-[#042861]" 
            : "bg-white border-[#042861] ring-1 ring-[#042861]"
          : isDark 
            ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" 
            : "bg-white border-stone-200 hover:border-stone-300"
      } ${task.completed ? "opacity-50" : ""} ${isDragging ? "opacity-50 scale-[0.98]" : ""}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Task: ${task.title}`}
    >
      {/* Drag Handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag task to reorder"
      >
        <GripVertical className={`w-4 h-4 ${isDark ? "text-zinc-600" : "text-stone-300"}`} />
      </div>

      <div className="flex items-start gap-3 pl-4">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
            task.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : isDark ? "border-zinc-600 hover:border-zinc-500" : "border-stone-300 hover:border-stone-400"
          }`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        <div 
          className="flex-1 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                    } else {
                      handleSave();
                    }
                  }
                  if (e.key === 'Escape') handleCancel();
                }}
                className={`w-full bg-transparent border-b focus:outline-none font-medium ${
                  isDark ? "text-white border-zinc-700" : "text-stone-900 border-stone-200"
                }`}
                placeholder="Task title"
                aria-label="Edit task title"
              />
              <textarea
                ref={textareaRef}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') handleCancel();
                }}
                className={`w-full bg-transparent border-b focus:outline-none text-sm resize-none ${
                  isDark ? "text-zinc-400 border-zinc-800" : "text-stone-500 border-stone-200"
                }`}
                rows={2}
                placeholder="Add details..."
                aria-label="Edit task description"
              />
            </div>
          ) : (
            <>
              <h3
                onClick={handleTitleClick}
                className={`font-medium transition-all break-words ${
                  task.completed ? "line-through" : ""
                } ${isDark ? "text-white" : "text-stone-900"} ${
                  !isEditing ? "hover:opacity-80 cursor-text" : ""
                }`}
              >
                {task.title || "Untitled task"}
              </h3>

              {task.description ? (
                <div
                  onClick={handleDescClick}
                  className={`mt-1 text-sm cursor-pointer transition-all ${
                    isDark ? "text-zinc-500 hover:text-zinc-300" : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {isExpanded ? (
                    <p className="whitespace-pre-wrap">{task.description}</p>
                  ) : (
                    <p className="truncate">{task.description}</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleDescClick}
                  className={`mt-1 text-sm font-medium transition-colors ${
                    isDark ? "text-zinc-600 hover:text-zinc-400" : "text-stone-400 hover:text-stone-600"
                  }`}
                  aria-label="Add description to task"
                >
                  + Add details...
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(task.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              task.pinned
                ? "bg-amber-500/20 text-amber-500"
                : isDark ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-stone-100 text-stone-400"
            }`}
            aria-label={task.pinned ? "Unpin task" : "Pin task"}
          >
            <Pin className={`w-4 h-4 ${task.pinned ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this task?")) {
                onDeleteTask(task.id);
              }
            }}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-red-900/20 text-zinc-500 hover:text-red-400" : "hover:bg-red-50 text-stone-400 hover:text-red-500"}`}
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}