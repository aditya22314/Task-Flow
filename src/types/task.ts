export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
