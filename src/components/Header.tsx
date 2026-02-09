import { useState } from "react";
import { Moon, Sun, Zap, Menu } from "lucide-react";

interface HeaderProps {
  currentList: string;
  lists: string[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectList: (list: string) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (name: string) => void;
  onRenameList: (oldName: string, newName: string) => void;
  onToggleTheme: () => void;
  isDark: boolean;
  batteryLevel: number | null;
  isOnline: boolean;
  lastSync: string | null;
  syncStatus: "synced" | "syncing" | "error";
  showBackButton?: boolean;
  onBack?: () => void;
  view: string;
}

export function Header({
  currentList,
  lists,
  searchTerm,
  onSearchChange,
  onSelectList,
  onCreateList,
  // onDeleteList, onRenameList rimossi
  onToggleTheme,
  isDark,
  batteryLevel,
  // isOnline, lastSync, view rimossi
  syncStatus,
  showBackButton,
  onBack,
}: HeaderProps) {
  const [showListDropdown, setShowListDropdown] = useState(false);

  const filteredLists = lists.filter(list => 
    list.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className={`px-4 py-3 flex items-center justify-between border-b transition-colors duration-300 ${
      isDark ? "bg-[#1A1A1A] border-zinc-800" : "bg-stone-50 border-stone-200"
    }`}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBack}
            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800 text-white" : "hover:bg-stone-200 text-stone-900"}`}
            aria-label="Go back"
          >
            ←
          </button>
        )}
        
        <div className="relative">
          {/* Menu Icon Button (3 lines) */}
          <button
            onClick={() => setShowListDropdown(!showListDropdown)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-zinc-800 text-white" : "hover:bg-stone-200 text-stone-900"
            }`}
            aria-label="Open lists menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {showListDropdown && (
            <div className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl z-50 overflow-hidden border animate-in slide-in-from-top-2 ${
              isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-stone-200"
            }`}>
              <div className="p-3 border-b border-zinc-700/50">
                <div className="flex flex-col gap-2 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-stone-400"}`}>
                    Current List
                  </span>
                  {/* Current List Name Display */}
                  <span className={`text-lg font-bold ${isDark ? "text-white" : "text-stone-900"}`}>
                    {currentList}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {/* Battery Display - Always Visible */}
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                    isDark ? "bg-zinc-900 text-zinc-300" : "bg-stone-100 text-stone-600"
                  }`}>
                    <Zap className={`w-3 h-3 ${batteryLevel && batteryLevel < 20 ? "text-red-500" : ""}`} />
                    <span>{batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : "N/A"}</span>
                  </div>
                </div>
                
                {/* Search Input inside Dropdown */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Search lists..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors ${
                      isDark 
                        ? "bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-700 focus:border-[#042861]" 
                        : "bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 focus:border-[#042861]"
                    }`}
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                {filteredLists.length > 0 ? (
                  filteredLists.map((list) => (
                    <button
                      key={list}
                      onClick={() => {
                        onSelectList(list);
                        setShowListDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                        list === currentList
                          ? isDark ? "bg-zinc-700 text-white" : "bg-stone-100 text-stone-900"
                          : isDark ? "text-zinc-300 hover:bg-zinc-700/50" : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {list}
                    </button>
                  ))
                ) : (
                  <div className={`text-center py-4 text-sm ${isDark ? "text-zinc-500" : "text-stone-400"}`}>
                    No lists found
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-zinc-700/50">
                <button
                  onClick={() => {
                    const name = prompt("New list name:");
                    if (name) {
                      onCreateList(name);
                      onSelectList(name);
                    }
                    setShowListDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isDark ? "text-zinc-400 hover:bg-zinc-700/50" : "text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-lg leading-none">+</span> Create New List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mr-2">
          <div className={`w-2 h-2 rounded-full ${
            syncStatus === "synced" ? "bg-emerald-500" : syncStatus === "syncing" ? "bg-amber-500 animate-pulse" : "bg-red-500"
          }`} />
          <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
            {syncStatus === "synced" ? "Synced" : syncStatus === "syncing" ? "Syncing..." : "Error"}
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800 text-indigo-400" : "hover:bg-stone-200 text-amber-600"}`}
          aria-label="Toggle theme"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
