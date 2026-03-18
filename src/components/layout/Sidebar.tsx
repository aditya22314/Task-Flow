import { DashboardStats } from '../dashboard/DashboardStats';
import { DashboardFilters } from '../dashboard/DashboardFilters';
import { motion } from 'framer-motion';

export function Sidebar() {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="w-full lg:w-64 shrink-0 space-y-8"
        >
            <DashboardStats />
            <DashboardFilters />
        </motion.div>
    );
}
