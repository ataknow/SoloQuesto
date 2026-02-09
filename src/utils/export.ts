import { Task } from "../types";

export function exportTasks(tasks: Task[], listName: string, format: "txt" | "md") {
  const activeTasks = tasks.filter((t) => !t.completed && !t.archived);
  
  let content = "";
  let filename = "";
  let mimeType = "";

  if (format === "txt") {
    content = activeTasks.map((t) => t.title).join("\n");
    filename = `${listName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    mimeType = "text/plain";
  } else if (format === "md") {
    content = `# ${listName}\n\n${activeTasks.map((t) => `- [ ] ${t.title}`).join("\n")}`;
    filename = `${listName.toLowerCase().replace(/\s+/g, "-")}.md`;
    mimeType = "text/markdown";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importTasks(file: File): Promise<{ title: string; note?: string }[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      const tasks = lines.map((line) => ({ title: line.trim() }));
      resolve(tasks);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}