import { Task } from "../hooks/useTasks";

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
}: ListBrowserProps) {
  const filteredLists = lists.filter(list => 
    list.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskCount = (listName: string) => {
    return tasks.filter(t => t.list === listName && !t.completed).length;
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-2 gap-3">
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