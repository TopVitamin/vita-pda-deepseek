import { create } from 'zustand';
import type { TaskItem } from '@/types';
import { mockTasks } from '@/mock/tasks';

interface TaskState {
  tasks: TaskItem[];
  currentTask: TaskItem | null;
  loading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  loadTaskByNo: (taskNo: string) => Promise<TaskItem | null>;
  updateTaskStatus: (taskNo: string, status: string, doneQty?: number) => void;
  getTasksByType: (type: string) => TaskItem[];
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,

  loadTasks: async () => {
    const { tasks } = get();
    if (tasks.length > 0) return;

    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      set({ tasks: mockTasks, loading: false });
    } catch {
      set({ loading: false, error: '加载任务列表失败，请重试' });
    }
  },

  loadTaskByNo: async (taskNo: string): Promise<TaskItem | null> => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { tasks } = get();
      let task: TaskItem | undefined = tasks.find((t) => t.taskNo === taskNo);

      if (!task) {
        task = mockTasks.find((t) => t.taskNo === taskNo);
      }

      const result: TaskItem | null = task ?? null;
      set({ currentTask: result, loading: false });
      return result;
    } catch {
      set({ loading: false, error: '加载任务详情失败，请重试' });
      return null;
    }
  },

  updateTaskStatus: (taskNo: string, status: string, doneQty?: number) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.taskNo === taskNo) {
          const updated = { ...task, status: status as TaskItem['status'] };
          if (doneQty !== undefined) {
            updated.doneQty = doneQty;
          }
          return updated;
        }
        return task;
      });

      const updatedCurrentTask: TaskItem | null =
        state.currentTask?.taskNo === taskNo
          ? {
              ...state.currentTask,
              status: status as TaskItem['status'],
              ...(doneQty !== undefined ? { doneQty } : {}),
            }
          : state.currentTask;

      return { tasks: updatedTasks, currentTask: updatedCurrentTask };
    });
  },

  getTasksByType: (type: string) => {
    const { tasks } = get();
    return tasks.filter((t) => t.type === type);
  },
}));
