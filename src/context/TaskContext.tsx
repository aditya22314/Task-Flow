import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task, Priority, Status } from '../types/task';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskStatus: (id: string) => void;

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
    };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setTasks([...tasks, newTask]);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const toggleTaskStatus = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status: task.status === 'completed' ? 'pending' : 'completed',
                        updatedAt: new Date(),
                    }
                    : task
            )
        );
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || task.status === 'statusFilter'; // WILL FIX TYPO IN A MOMENT, wait I'll fix it now: task.status === statusFilter
        const actualMatchesStatus = statusFilter === 'all' || task.status === statusFilter;

        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && actualMatchesStatus && matchesPriority;
    });

    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        pending: tasks.filter((t) => t.status === 'pending').length,
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                deleteTask,
                toggleTaskStatus,
                searchQuery,
                setSearchQuery,
                statusFilter,
                setStatusFilter,
                priorityFilter,
                setPriorityFilter,
                filteredTasks,
                stats,
            }}
        >
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
