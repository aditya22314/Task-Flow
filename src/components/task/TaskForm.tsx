import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Task, Priority } from '../../types/task';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface TaskFormProps {
    task?: Task; // If provided, we are editing. If not, creating.
    onSuccess?: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
    const { addTask, updateTask } = useTasks();
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
    const [status, setStatus] = useState<Task['status']>(task?.status || 'pending');
    const [dueDate, setDueDate] = useState(
        task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        };

        if (task) {
            updateTask(task.id, taskData);
        } else {
            addTask(taskData);
        }

        if (onSuccess) {
            onSuccess();
        } else {
            // Clear form if it's a creation form without success handler
            setTitle('');
            setDescription('');
            setPriority('medium');
            setStatus('pending');
            setDueDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                    id="title"
                    placeholder="e.g. Finish weekly report"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                    className="bg-muted/50"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                    id="description"
                    placeholder="Add details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-muted/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(val) => setStatus(val as Task['status'])}>
                        <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                        <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="bg-muted/50"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                {onSuccess && (
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Cancel
                    </Button>
                )}
                <Button type="submit">
                    {task ? 'Save Changes' : 'Create Task'}
                </Button>
            </div>
        </form>
    );
}
