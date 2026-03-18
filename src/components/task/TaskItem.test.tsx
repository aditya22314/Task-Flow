import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskItem } from './TaskItem';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../types/task';

// Mock contexts and hooks
vi.mock('../../context/TaskContext', () => ({
    useTasks: vi.fn(),
}));

vi.mock('@dnd-kit/sortable', () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

const mockTask: Task = {
    id: 'test-123',
    title: 'Test Task Title',
    description: 'Test Description Content',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('TaskItem', () => {
    const toggleTaskStatusMock = vi.fn();
    const deleteTaskMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useTasks as any).mockReturnValue({
            toggleTaskStatus: toggleTaskStatusMock,
            deleteTask: deleteTaskMock,
        });
    });

    it('renders task details correctly in list view', () => {
        render(<TaskItem task={mockTask} viewMode="list" />);

        expect(screen.getByText('Test Task Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description Content')).toBeInTheDocument();
        expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('renders task details correctly in card view', () => {
        render(<TaskItem task={mockTask} viewMode="card" />);

        expect(screen.getByText('Test Task Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description Content')).toBeInTheDocument();
    });

    it('calls toggleTaskStatus when the status button is clicked', () => {
        render(<TaskItem task={mockTask} viewMode="list" />);

        // The status button is the first button inside the list item that matches the role
        const buttons = screen.getAllByRole('button');
        const statusBtn = buttons[0]; // buttons[0] is the status button
        fireEvent.click(statusBtn);

        expect(toggleTaskStatusMock).toHaveBeenCalledWith('test-123');
        expect(toggleTaskStatusMock).toHaveBeenCalledTimes(1);
    });
});
