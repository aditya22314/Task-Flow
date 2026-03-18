import { renderHook, act } from "@testing-library/react";
import { useTaskManager } from "./useTaskManager";

// Mock localStorage
const mockStorage: { [key: string]: string } = {};
globalThis.localStorage = {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStorage[key];
  }),
  length: 0,
  key: vi.fn(),
} as Storage;

describe("useTaskManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty tasks", () => {
    const { result } = renderHook(() => useTaskManager());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.stats).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
    });
  });

  it("should add a task correctly", () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Test Task");
    expect(result.current.tasks[0].status).toBe("pending");
    expect(result.current.tasks[0].priority).toBe("high");
    expect(result.current.tasks[0].id).toBeDefined();
    expect(result.current.stats.total).toBe(1);
  });

  it("should toggle task status", () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask({
        title: "Test Task",
        status: "pending",
        priority: "medium",
      });
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTaskStatus(taskId);
    });

    expect(result.current.tasks[0].status).toBe("completed");
    expect(result.current.stats.completed).toBe(1);

    act(() => {
      result.current.toggleTaskStatus(taskId);
    });

    expect(result.current.tasks[0].status).toBe("pending");
    expect(result.current.stats.pending).toBe(1);
  });

  it("should delete a task", () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask({
        title: "Test Task",
        status: "pending",
        priority: "medium",
      });
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.stats.total).toBe(0);
  });

  it("should filter tasks correctly", () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask({
        title: "Task 1",
        status: "pending",
        priority: "high",
      });
      result.current.addTask({
        title: "Task 2",
        status: "completed",
        priority: "low",
      });
      result.current.addTask({
        title: "Target Search",
        status: "pending",
        priority: "medium",
      });
    });

    // Test Status Filter
    act(() => {
      result.current.setStatusFilter("completed");
    });
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe("Task 2");

    act(() => {
      result.current.setStatusFilter("all");
      result.current.setPriorityFilter("high");
    });
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe("Task 1");

    act(() => {
      result.current.setPriorityFilter("all");
      result.current.setSearchQuery("target");
    });
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe("Target Search");
  });
});
