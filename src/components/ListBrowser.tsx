import { useState, useEffect, useRef } from "react";
import { Task } from "../hooks/useTasks";
import { Plus, X, Check } from "lucide-react";

interface ListBrowserProps {
  lists: string[];
  tasks: Task[];
  currentList: string;
  searchTerm: string;
  onSelectList: (list: string) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (name: string) => void;
  onRenameList: (oldName: string, newName: string) => void;
  isDark: boolean;
  // Nuovi props per la gestione inline
  isCreating: boolean;
  onToggleCreate: () => void;
}

export function ListBrowser({
  lists,
  tasks,
  currentList,
  searchTerm,
  onSelectList,
  onCreateList,
  onDeleteList,
  onRenameList,
  isDark,
  isCreating,
  onToggleCreate,
}: ListBrowserProps) {
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus quando si apre la creazione
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Reset input quando si chiude
  useEffect(() => {
    if (!isCreating) {
      setNewListName("");
    }
  }, [isCreating]);

  const filteredLists = lists.filter(list => 
    list.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskCount = (listName: string) => {
    return tasks.filter(t => t.list === listName && !t.completed).length;
  };

  const handleCreateSubmit = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName("");
      onToggleCreate(); // Chiude il form
    }
  };

  const handleCancel = () => {
    setNewListName("");
    onToggleCreate();
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Card di Creazione (Inline) - Ora col-span-1 per grandezza normale */}
        {isCreating && (
          <div className={`col-span-1 p-4 rounded-2xl border transition-all ${
            isDark 
              ? "bg-zinc-800 border-[#042861] ring-1 ring-[#042861]" 
              : "bg-white border-[#042861] ring-1 ring-[#042861]"
          }`}>
            <div className="flex flex-col gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateSubmit();
                  if (e.key === "Escape") handleCancel();
                }}
                placeholder="Nome lista..."
                className={`w-full text-base font-medium bg-transparent focus:outline-none ${
                  isDark ? "text-white placeholder-zinc-500" : "text-stone-900 placeholder-stone-400"
                }`}
                autoFocus
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleCreateSubmit}
                  disabled={!newListName.trim()}
                  className="flex-1 py-2 rounded-lg bg-[#042861] text-white font-medium text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5" />
                  Crea
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded-lg border font-medium text-xs flex items-center justify-center active:scale-95 transition-transform hover:bg-opacity-80"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    color: isDark ? '#fff' : '#000'
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste Esistenti */}
        {filteredLists.map((list) => {
          const pendingTasks = getTaskCount(list);
          return (
            <button
              key={list}
              onClick={() => onSelectList(list)}
              className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                list === currentList
                  ? isDark 
                    ? "bg-[#042861] border-[#042861] text-white" 
                    : "bg-[#042861] border-[#042861] text-white"
                  : isDark 
                    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white" 
                    : "bg-white border-stone-200 hover:border-stone-300 text-stone-900"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold truncate pr-2">{list}</h3>
                {list === currentList && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                )}
              </div>
              <p className={`text-xs ${list === currentList ? "text-blue-100" : isDark ? "text-zinc-500" : "text-stone-500"}`}>
                {pendingTasks} task{pendingTasks !== 1 ? "s" : ""} pending
              </p>
            </button>
          );
        })}
      </div>

      {filteredLists.length === 0 && searchTerm && (
        <div className={`text-center py-12 ${isDark ? "text-zinc-500" : "text-stone-400"}`}>
          <p>No lists found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}