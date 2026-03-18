import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskItem } from '../task/TaskItem';
import type { Task, Status } from '../../types/task';
import { cn } from '../../lib/utils';
import { AnimatePresence } from 'framer-motion';

interface KanbanColumnProps {
    id: Status;
    title: string;
    tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col bg-muted/30 rounded-xl overflow-hidden h-full border border-border/50">
            <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
                <span className="bg-background px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground border">
                    {tasks.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-3 flex flex-col gap-3 min-h-[150px] transition-colors",
                    isOver && "bg-muted/50 ring-2 ring-primary/20 ring-inset"
                )}
            >
                <SortableContext
                    id={id}
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <AnimatePresence mode="popLayout">
                        {tasks.map(task => (
                            <TaskItem key={task.id} task={task} viewMode="card" />
                        ))}
                    </AnimatePresence>
                </SortableContext>
            </div>
        </div>
    );
}
