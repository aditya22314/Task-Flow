import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, List, LayoutGrid, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { TaskForm } from '../task/TaskForm';

interface DashboardToolbarProps {
    viewMode: 'list' | 'card';
    setViewMode: (mode: 'list' | 'card') => void;
}

export function DashboardToolbar({ viewMode, setViewMode }: DashboardToolbarProps) {
    const { searchQuery, setSearchQuery } = useTasks();
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/40 border-muted placeholder:text-muted-foreground/70 rounded-full h-10 shadow-none focus-visible:ring-primary/50"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center p-1 bg-muted/40 rounded-lg border border-border/50 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={`h-8 w-8 rounded-md ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('card')}
                        className={`h-8 w-8 rounded-md ${viewMode === 'card' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <Button onClick={() => setIsAddOpen(true)} className="rounded-full shadow-sm hover:shadow transition-all gap-1.5 h-10 px-5 flex-1 sm:flex-none">
                        <Plus className="h-4 w-4" />
                        <span>New Task</span>
                    </Button>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>
                        <TaskForm onSuccess={() => setIsAddOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
