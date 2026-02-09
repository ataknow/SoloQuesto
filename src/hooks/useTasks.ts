import { useState, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pinned: boolean;
  list: string;
  createdAt: number;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<string[]>(["My List"]);
  const [currentList, setCurrentList] = useState("My List");
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("focuslist-tasks");
    const savedLists = localStorage.getItem("focuslist-lists");
    const savedCurrentList = localStorage.getItem("focuslist-current");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedLists) setLists(JSON.parse(savedLists));
    if (savedCurrentList) setCurrentList(savedCurrentList);
  }, []);

  // Save to localStorage
  useEffect(() => {
    setSyncStatus("syncing");
    localStorage.setItem("focuslist-tasks", JSON.stringify(tasks));
    localStorage.setItem("focuslist-lists", JSON.stringify(lists));
    localStorage.setItem("focuslist-current", currentList);
    
    setTimeout(() => setSyncStatus("synced"), 500);
  }, [tasks, lists, currentList]);

  // Returns the ID of the newly created task
  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "list">): string => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      list: currentList,
    };
    // Append to bottom instead of top
    setTasks((prev) => [...prev, newTask]);
    return newTask.id;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const togglePin = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, pinned: !task.pinned } : task
      )
    );
  };

  const reorderTasks = (fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      const [removed] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, removed);
      return newTasks;
    });
  };

  const createList = (name: string) => {
    if (name && !lists.includes(name)) {
      // Append to bottom
      setLists((prev) => [...prev, name]);
    } else if (!name) {
      // Allow creating empty list for immediate editing
      setLists((prev) => [...prev, name]);
    }
  };

  const selectList = (list: string) => {
    setCurrentList(list);
  };

  const deleteList = (name: string) => {
    setLists((prev) => prev.filter((l) => l !== name));
    setTasks((prev) => prev.filter((t) => t.list !== name));
    if (currentList === name) {
      setCurrentList(lists[0] || "My List");
    }
  };

  const renameList = (oldName: string, newName: string) => {
    setLists((prev) => prev.map((l) => (l === oldName ? newName : l)));
    setTasks((prev) =>
      prev.map((t) => (t.list === oldName ? { ...t, list: newName } : t))
    );
    if (currentList === oldName) {
      setCurrentList(newName);
    }
  };

  const syncNow = () => {
    setSyncStatus("syncing");
    setTimeout(() => setSyncStatus("synced"), 1000);
  };

  return {
    tasks,
    lists,
    currentList,
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
  };
}