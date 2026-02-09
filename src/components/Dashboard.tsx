import { useState } from "react";
import { Plus, Edit } from "lucide-react";

interface DashboardProps {
  lists: string[];
  onSelectList: (id: string) => void;
  onCreateList: (name: string) => void;
  isDark: boolean;
}

export function Dashboard({ lists, onSelectList, onCreateList, isDark }: DashboardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleCreate = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-stone-900"}`}>
        My Lists
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Create New List Card */}
        <div
          onClick={() => setIsCreating(true)}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:opacity-80 ${
            isDark ? "border-zinc-800 hover:border-zinc-700" : "border-stone-300 hover:border-stone-400"
          }`}
        >
          <Plus className={`w-8 h-8 mb-2 ${isDark ? "text-zinc-600" : "text-stone-400"}`} />
          <span className={`font-medium ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
            Create New List
          </span>
        </div>

        {/* Existing Lists */}
        {lists.map((listName, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
              isDark ? "bg-zinc-900 border border-zinc-800 hover:border-zinc-700" : "bg-white border border-stone-200 hover:border-stone-300 shadow-sm"
            }`}
            onClick={() => onSelectList(listName)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-zinc-800" : "bg-stone-100"}`}>
                  <Edit className={`w-5 h-5 ${isDark ? "text-zinc-400" : "text-stone-500"}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-stone-900"}`}>
                    {listName}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
                    0 tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create List Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${
            isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-stone-200"
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-stone-900"}`}>
              New List
            </h2>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              placeholder="List name..."
              className={`w-full p-3 rounded-xl border mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isDark 
                  ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600" 
                  : "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400"
              }`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewListName("");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
