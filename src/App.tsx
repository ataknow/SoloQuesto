import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { FocusMode } from "./components/FocusMode";
import { OnboardingModal } from "./components/OnboardingModal";
import { BottomNav } from "./components/BottomNav";
import { ListBrowser } from "./components/ListBrowser";
import { Settings } from "./components/Settings";
import { ImportExport } from "./components/ImportExport";
import { useTasks } from "./hooks/useTasks";
import { useDarkMode } from "./hooks/useDarkMode";
import { useDeviceStatus } from "./hooks/useDeviceStatus";
import { useVoiceInput } from "./hooks/useVoiceInput";
import { Plus, Menu, RefreshCw } from "lucide-react";
import { exportTasks, importTasks } from "./utils/export";

type View = "lists" | "tasks" | "import" | "settings";

function App() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { batteryLevel, isOnline, lastSync } = useDeviceStatus();
  const { startListening: startVoiceImport } = useVoiceInput();
  const {
    tasks,
    currentList,
    lists,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    togglePin,
    reorderTasks,
    createList,
    selectList,
    deleteList,
    renameList,
    syncStatus,
    syncNow,
  } = useTasks();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [view, setView] = useState<View>("lists");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Stato per la creazione inline della lista
  const [isCreatingList, setIsCreatingList] = useState(false);
  
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editedListName, setEditedListName] = useState(currentList);
  const listNameInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [showListMenu, setShowListMenu] = useState(false);
  
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      if (currentScrollY > 80 && currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
      } 
      else if (currentScrollY < 30 || currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("focuslist-onboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    setEditedListName(currentList);
  }, [currentList]);

  useEffect(() => {
    if (isEditingListName && listNameInputRef.current) {
      listNameInputRef.current.focus();
    }
  }, [isEditingListName]);

  const handleSelectList = (list: string) => {
    if (list === "") return; 
    selectList(list);
    setView("tasks");
    setSelectedTaskId(null);
    setSearchTerm("");
  };

  const handleBack = () => {
    setView("lists");
    setSelectedTaskId(null);
  };

  const handleSaveListName = () => {
    if (editedListName.trim() && editedListName !== currentList) {
      renameList(currentList, editedListName.trim());
    }
    setIsEditingListName(false);
  };

  const handleDeleteCurrentList = () => {
    if (confirm(`Delete "${currentList}" and all its tasks?`)) {
      deleteList(currentList);
      setView("lists");
    }
  };

  const handleAddTask = () => {
    const newTask = { title: "", description: "", completed: false, pinned: false };
    const newId = addTask(newTask);
    setSelectedTaskId(newId);
    setTimeout(() => {
      mainRef.current?.scrollTo({ top: mainRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const handleSelectTask = (id: string | null) => {
    setSelectedTaskId(id);
  };

  // FIX: Attiva lo stato e scrolla in alto per vedere l'input
  const handleAddList = () => {
    setIsCreatingList(true);
    // Scrolla in alto per mostrare il campo di input
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = (format: "txt") => {
    exportTasks(tasks, currentList, format);
  };

  const handleImport = async (file: File) => {
    const importedTasks = await importTasks(file);
    importedTasks.forEach(task => addTask(task));
  };

  const handleVoiceImport = async () => {
    try {
      const text = await startVoiceImport();
      if (text) {
        const lines = text.split(/,|\n|\. /).filter(line => line.trim().length > 2);
        lines.forEach(line => addTask({ title: line.trim(), description: "", completed: false, pinned: false }));
      }
    } catch (error) {
      console.error("Voice import error:", error);
    }
  };

  const handlePhotoImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const mockExtractedText = prompt(
          "OCR Preview - Edit extracted text:",
          "Buy milk\nCall mom\nFinish report"
        );
        if (mockExtractedText) {
          const lines = mockExtractedText.split("\n").filter((line) => line.trim());
          lines.forEach((line) => addTask({ title: line.trim(), description: "", completed: false, pinned: false }));
        }
      }
    };
    input.click();
  };

  const currentTasks = tasks.filter(t => t.list === currentList);
  const taskToFocus = selectedTaskId 
    ? currentTasks.find(t => t.id === selectedTaskId)
    : currentTasks.find(t => !t.completed && !t.archived);

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-stone-100 transition-colors duration-300">
      <div className={`w-full max-w-md h-screen md:h-[850px] md:rounded-3xl md:border-8 overflow-hidden relative flex flex-col shadow-2xl transition-colors duration-300 ${
        isDark 
          ? "bg-[#1A1A1A] md:border-zinc-800" 
          : "bg-stone-50 md:border-stone-200"
      }`}>
        <div className={`absolute top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}>
          <Header
            currentList={currentList}
            lists={lists}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectList={handleSelectList}
            onCreateList={createList}
            onDeleteList={deleteList}
            onRenameList={renameList}
            onToggleTheme={toggleDarkMode}
            isDark={isDark}
            batteryLevel={batteryLevel}
            isOnline={isOnline}
            lastSync={lastSync}
            syncStatus={syncStatus}
            showBackButton={view === "tasks"}
            onBack={handleBack}
            view={view}
          />
        </div>

        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden relative pt-16">
          {focusMode && taskToFocus ? (
            <FocusMode
              task={taskToFocus}
              onComplete={() => {
                toggleComplete(taskToFocus.id);
                setSelectedTaskId(null);
                const next = currentTasks.find(t => !t.completed && !t.archived && t.id !== taskToFocus.id);
                if (!next) setFocusMode(false);
              }}
              onExit={() => {
                setFocusMode(false);
                setSelectedTaskId(null);
              }}
              isDark={isDark}
            />
          ) : (
            <>
              {view === "lists" && (
                <div className="px-4 pb-24 min-h-full">
                  <ListBrowser
                    lists={lists}
                    tasks={tasks}
                    currentList={currentList}
                    searchTerm={searchTerm}
                    onSelectList={handleSelectList}
                    onCreateList={createList}
                    onDeleteList={deleteList}
                    onRenameList={renameList}
                    isDark={isDark}
                    isCreating={isCreatingList}
                    onToggleCreate={() => setIsCreatingList(!isCreatingList)}
                  />
                </div>
              )}

              {view === "tasks" && (
                <div className="px-4 pb-24 min-h-full relative">
                  <div className={`py-6 transition-colors duration-300 ${
                    isDark ? "bg-[#1A1A1A]" : "bg-stone-50"
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        {isEditingListName ? (
                          <input
                            ref={listNameInputRef}
                            type="text"
                            value={editedListName}
                            onChange={(e) => setEditedListName(e.target.value)}
                            onBlur={handleSaveListName}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveListName();
                              if (e.key === "Escape") {
                                setEditedListName(currentList);
                                setIsEditingListName(false);
                              }
                            }}
                            className={`w-full text-2xl font-bold bg-transparent border-b-2 focus:outline-none py-1 transition-colors ${
                              isDark 
                                ? "text-white border-[#042861]" 
                                : "text-stone-900 border-stone-300"
                            }`}
                          />
                        ) : (
                          <h1
                            onClick={() => setIsEditingListName(true)}
                            className={`text-2xl font-bold cursor-text transition-colors ${
                              isDark ? "text-white hover:text-zinc-200" : "text-stone-900 hover:text-stone-700"
                            }`}
                          >
                            {currentList}
                          </h1>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setShowListMenu(!showListMenu)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-transform ${
                            isDark ? "bg-zinc-900" : "bg-white border border-stone-200"
                          }`}
                        >
                          <Menu className={`w-5 h-5 ${isDark ? "text-white" : "text-stone-900"}`} />
                        </button>

                        {showListMenu && (
                          <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-2xl z-30 overflow-hidden animate-in slide-in-from-top-2 border ${
                            isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-stone-200"
                          }`}>
                            <button
                              onClick={() => {
                                syncNow();
                                setShowListMenu(false);
                              }}
                              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${
                                isDark ? "hover:bg-zinc-700" : "hover:bg-stone-50"
                              }`}
                            >
                              <RefreshCw className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-stone-500"}`} />
                              <span className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>Synchronize List</span>
                            </button>
                            <button
                              onClick={handleDeleteCurrentList}
                              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left border-t ${
                                isDark 
                                  ? "hover:bg-red-900/30 border-zinc-700" 
                                  : "hover:bg-red-50 border-stone-100"
                              }`}
                            >
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              <span className="text-sm font-medium text-red-500">Delete List</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setFocusMode(true)}
                      disabled={!taskToFocus}
                      className={`w-full p-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                        taskToFocus
                          ? "bg-[#042861] text-white"
                          : isDark 
                            ? "bg-zinc-900 text-zinc-500 cursor-not-allowed" 
                            : "bg-white border border-stone-200 text-stone-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="font-semibold">Focus Mode</span>
                    </button>
                  </div>

                  <TaskList
                    tasks={currentTasks}
                    showArchived={false}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    onToggleComplete={toggleComplete}
                    onTogglePin={togglePin}
                    onReorder={reorderTasks}
                    isDark={isDark}
                    selectedTaskId={selectedTaskId}
                    onSelectTask={handleSelectTask}
                    isFocusMode={false}
                  />
                </div>
              )}

              {view === "import" && (
                <ImportExport
                  onImport={handleImport}
                  onExport={handleExport}
                  onVoiceImport={handleVoiceImport}
                  onPhotoImport={handlePhotoImport}
                  isDark={isDark}
                />
              )}

              {view === "settings" && (
                <Settings
                  onExport={handleExport}
                  onImport={handleImport}
                  onVoiceImport={handleVoiceImport}
                  onPhotoImport={handlePhotoImport}
                  onClearData={() => {
                    if (confirm("Are you sure? This will delete all lists and tasks.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  batteryLevel={batteryLevel}
                  isOnline={isOnline}
                  isDark={isDark}
                  onToggleTheme={toggleDarkMode}
                />
              )}
            </>
          )}
        </main>

        {/* FAB for Lists */}
        {view === "lists" && (
          <div className="fixed bottom-24 right-4 z-50 md:absolute md:bottom-24 md:right-4">
            <button
              onClick={handleAddList}
              className="w-14 h-14 bg-[#042861] text-white rounded-full shadow-lg shadow-[#042861]/30 flex items-center justify-center active:scale-90 transition-transform hover:bg-[#042861]/90"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        )}

        {/* FAB for Tasks */}
        {view === "tasks" && !focusMode && (
          <div className="fixed bottom-24 right-4 z-50 md:absolute md:bottom-24 md:right-4">
            <button
              onClick={handleAddTask}
              className="w-14 h-14 bg-[#042861] text-white rounded-full shadow-lg shadow-[#042861]/30 flex items-center justify-center active:scale-90 transition-transform hover:bg-[#042861]/90"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        )}

        <BottomNav
          currentView={view}
          onTabChange={setView}
          isDark={isDark}
        />

        {showOnboarding && (
          <OnboardingModal 
            isOpen={showOnboarding} 
            onClose={() => {
              setShowOnboarding(false);
              localStorage.setItem("focuslist-onboarding", "true");
            }} 
            isDark={isDark} 
          />
        )}
      </div>
    </div>
  );
}

export default App;