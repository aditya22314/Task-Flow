import { createContext, useContext } from 'react';
import type { Task, Priority, Status } from '../types/task';
import { useTaskManager } from '../hooks/useTaskManager';

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskStatus: (id: string) => void;
    reorderTasks: (activeId: string, overId: string) => void;

    // Filtering & Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: Status | 'all';
    setStatusFilter: (status: Status | 'all') => void;
    priorityFilter: Priority | 'all';
    setPriorityFilter: (priority: Priority | 'all') => void;

    // Derived state
    filteredTasks: Task[];
    stats: {
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
    };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const taskManager = useTaskManager();

    return (
        <TaskContext.Provider value={taskManager}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
