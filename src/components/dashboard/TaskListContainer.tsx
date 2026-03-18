import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { TaskItem } from '../task/TaskItem';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { TaskForm } from '../task/TaskForm';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';

interface TaskListContainerProps {
    viewMode: 'list' | 'card';
}

export function TaskListContainer({ viewMode }: TaskListContainerProps) {
    const { filteredTasks, searchQuery, statusFilter, priorityFilter, reorderTasks } = useTasks();
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeTask = filteredTasks.find(t => t.id === activeId);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    if (filteredTasks.length === 0) {
        const isFiltering = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all';

        return (
            <div className="h-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-2xl bg-muted/10">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                    {isFiltering
                        ? "We couldn't find any tasks matching your filters. Try adjusting them."
                        : "You haven't added any tasks yet. Create one to get started!"}
                </p>
                {!isFiltering && (
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddOpen(true)}
                            className="mt-6 rounded-full"
                        >
                            Create your first task
                        </Button>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                            </DialogHeader>
                            <TaskForm onSuccess={() => setIsAddOpen(false)} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {viewMode === 'list' ? (
                <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-3">
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.map((task) => (
                                <TaskItem key={task.id} task={task} viewMode="list" />
                            ))}
                        </AnimatePresence>
                    </div>
                </SortableContext>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[60vh] items-start">
                    <KanbanColumn id="pending" title="To Do" tasks={pendingTasks} />
                    <KanbanColumn id="in-progress" title="In Progress" tasks={inProgressTasks} />
                    <KanbanColumn id="completed" title="Completed" tasks={completedTasks} />
                </div>
            )}

            <DragOverlay>
                {activeId && activeTask ? (
                    <TaskItem task={activeTask} viewMode={viewMode} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
