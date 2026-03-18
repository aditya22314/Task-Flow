import { useTasks } from '../../context/TaskContext';
import { Badge } from '../ui/badge';

export function DashboardStats() {
    const { stats } = useTasks();

    return (
        <div className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Overview</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center group">
                    <span className="text-sm font-medium">Total Tasks</span>
                    <Badge variant="secondary" className="rounded-full shadow-none">{stats.total}</Badge>
                </div>
                <div className="flex justify-between items-center group text-green-600 dark:text-green-500">
                    <span className="text-sm font-medium">Completed</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 shadow-none rounded-full">{stats.completed}</Badge>
                </div>
                <div className="flex justify-between items-center group text-yellow-600 dark:text-yellow-500">
                    <span className="text-sm font-medium">Pending</span>
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:hover:bg-yellow-500/30 shadow-none rounded-full">{stats.pending}</Badge>
                </div>
                <div className="flex justify-between items-center group text-blue-600 dark:text-blue-500">
                    <span className="text-sm font-medium">In Progress</span>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 shadow-none rounded-full">{stats.inProgress}</Badge>
                </div>
            </div>
        </div>
    );
}
