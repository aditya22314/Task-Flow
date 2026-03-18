import { useState } from 'react';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardToolbar } from '../components/dashboard/DashboardToolbar';
import { TaskListContainer } from '../components/dashboard/TaskListContainer';

export function Dashboard() {
    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

    return (
        <ThemeProvider defaultTheme="system" storageKey="dashboard-theme">
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
                <DashboardHeader />

                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <Sidebar />

                        <div className="flex-1 w-full flex flex-col min-w-0">
                            <DashboardToolbar viewMode={viewMode} setViewMode={setViewMode} />
                            <div className="flex-1">
                                <TaskListContainer viewMode={viewMode} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ThemeProvider>
    );
}
