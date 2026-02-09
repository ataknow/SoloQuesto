export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pinned: boolean;
  list: string;
  createdAt: number;
  archived: boolean;
}

export type View = "lists" | "tasks" | "import" | "settings";