import { ThemeToggle } from '../theme/ThemeToggle';
import { motion } from 'framer-motion';

export function DashboardHeader() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>
        </motion.header>
    );
}
