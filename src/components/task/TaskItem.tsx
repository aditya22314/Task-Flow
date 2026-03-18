import React from 'react';
import type { Task } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Calendar, CheckCircle2, Circle, Edit2, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { TaskForm } from './TaskForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskItemProps {
    task: Task;
    viewMode?: 'list' | 'card';
    isOverlay?: boolean;
}

export function TaskItem({ task, viewMode = 'list', isOverlay }: TaskItemProps) {
    const { toggleTaskStatus, deleteTask } = useTasks();
    const [isEditOpen, setIsEditOpen] = React.useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const priorityColors = {
        low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    };

    const isCompleted = task.status === 'completed';

    const TaskActions = () => (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTaskStatus(task.id)}
                className={cn("h-8 w-8 rounded-full transition-colors",
                    isCompleted ? "text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30" : "text-muted-foreground hover:text-primary"
                )}
            >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </Button>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <Button onClick={() => setIsEditOpen(true)} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <Edit2 className="h-4 w-4" />
                </Button>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <TaskForm task={task} onSuccess={() => setIsEditOpen(false)} />
                </DialogContent>
            </Dialog>

            <AlertDialog>
                <AlertDialogTrigger render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                } />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );


    if (viewMode === 'card') {
        return (
            <div
                ref={isOverlay ? undefined : setNodeRef}
                style={isOverlay ? undefined : style}
                className={cn("h-full", isDragging && !isOverlay && "opacity-50 z-50 relative")}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full"
                >
                    <Card className={cn("h-full flex flex-col transition-all duration-300 hover:shadow-lg border bg-card/50 backdrop-blur-sm group", isCompleted && "opacity-70 grayscale-[0.5]")}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-start gap-2 flex-1">
                                    <div className="p-1 h-6 w-6 mt-1 flex shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground touch-none" {...attributes} {...listeners}>
                                        <GripVertical className="h-4 w-4" />
                                    </div>
                                    <CardTitle className={cn("text-lg font-semibold leading-tight line-clamp-2", isCompleted && "line-through text-muted-foreground")}>
                                        {task.title}
                                    </CardTitle>
                                </div>
                                <Badge variant="outline" className={cn("capitalize rounded-full px-2.5 py-0.5 whitespace-nowrap", priorityColors[task.priority])}>
                                    {task.priority}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {task.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{task.description}</p>
                            )}
                            {task.dueDate && (
                                <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 w-fit px-2 py-1 rounded-md">
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-between items-center border-t border-border/50 bg-muted/20 px-6 py-3 mt-auto">
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="sr-only">Added</span>
                                {format(new Date(task.createdAt), 'MMM d')}
                            </div>
                            <TaskActions />
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // List View
    return (
        <div
            ref={isOverlay ? undefined : setNodeRef}
            style={isOverlay ? undefined : style}
            className={cn(isDragging && !isOverlay && "opacity-50 z-50 relative shadow-xl border-primary rounded-xl")}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                    "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:bg-card/90",
                    isCompleted && "opacity-75 bg-muted/20"
                )}
            >
                <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="p-1 h-6 w-6 mt-1 flex sm:mt-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground shrink-0 touch-none" {...attributes} {...listeners}>
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTaskStatus(task.id)}
                        className={cn("h-6 w-6 rounded-full shrink-0 transition-all",
                            isCompleted ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </Button>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className={cn("font-medium truncate text-base", isCompleted && "line-through text-muted-foreground")}>
                                {task.title}
                            </h3>
                            <Badge variant="outline" className={cn("capitalize text-[10px] h-5 px-2 rounded-full", priorityColors[task.priority])}>
                                {task.priority}
                            </Badge>
                        </div>
                        {task.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1 break-all pr-4">{task.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-10 sm:pl-0">
                    {task.dueDate && (
                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {format(new Date(task.dueDate), 'MMM d, yy')}
                        </div>
                    )}
                    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <Button onClick={() => setIsEditOpen(true)} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Task</DialogTitle>
                                </DialogHeader>
                                <TaskForm task={task} onSuccess={() => setIsEditOpen(false)} />
                            </DialogContent>
                        </Dialog>

                        <AlertDialog>
                            <AlertDialogTrigger render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            } />
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this task? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteTask(task.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
