export interface Task {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  list: string;
}