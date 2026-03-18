import { useTasks } from '../../context/TaskContext';
import { Button } from '../ui/button';

export function DashboardFilters() {
    const { statusFilter, setStatusFilter, priorityFilter, setPriorityFilter } = useTasks();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium mb-3">Filter by Status</h3>
                <div className="flex flex-wrap gap-2">
                    {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className="rounded-full h-8 text-xs capitalize shadow-none transition-colors"
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-3">Filter by Priority</h3>
                <div className="flex flex-wrap gap-2">
                    {(['all', 'low', 'medium', 'high'] as const).map((priority) => (
                        <Button
                            key={priority}
                            variant={priorityFilter === priority ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPriorityFilter(priority)}
                            className="rounded-full h-8 text-xs capitalize shadow-none transition-colors"
                        >
                            {priority}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
