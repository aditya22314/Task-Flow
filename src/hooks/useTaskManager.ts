import { useState, useMemo } from "react";
import type { Task, Priority, Status } from "../types/task";
import { useLocalStorage } from "./useLocalStorage";

export function useTaskManager() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
              updatedAt: new Date(),
            }
          : task,
      ),
    );
  };

  const reorderTasks = (activeId: string, overId: string) => {
    setTasks((prev) => {
      const activeTaskIndex = prev.findIndex((t) => t.id === activeId);
      if (activeTaskIndex === -1) return prev;

      const newTasks = [...prev];
      const [activeTask] = newTasks.splice(activeTaskIndex, 1);

      const overTaskIndex = newTasks.findIndex((t) => t.id === overId);

      if (overTaskIndex !== -1) {
        // Dropped over another task, match its status and insert at its index
        activeTask.status = newTasks[overTaskIndex].status;
        newTasks.splice(overTaskIndex, 0, activeTask);
      } else {
        // Dropped over an empty column or container ID directly
        if (["pending", "in-progress", "completed"].includes(overId)) {
          activeTask.status = overId as Status;
        }
        newTasks.push(activeTask);
      }

      activeTask.updatedAt = new Date();
      return newTasks;
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed").length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
    };
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    reorderTasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredTasks,
    stats,
  };
}
