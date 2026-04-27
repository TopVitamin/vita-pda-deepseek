import type { ApiResponse, TaskItem } from '@/types';
import { mockTasks } from '@/mock/tasks';

export async function getTasks(
  params?: Partial<{
    type: string;
    status: string;
    priority: string;
    page: number;
    pageSize: number;
  }>
): Promise<ApiResponse<TaskItem[]>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  let filtered = [...mockTasks];

  if (params?.type) {
    filtered = filtered.filter((t) => t.type === params.type);
  }
  if (params?.status) {
    filtered = filtered.filter((t) => t.status === params.status);
  }
  if (params?.priority) {
    filtered = filtered.filter((t) => t.priority === params.priority);
  }

  // 分页
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    code: 200,
    message: '获取任务列表成功',
    data: paged,
  };
}

export async function getTaskByNo(
  taskNo: string
): Promise<ApiResponse<TaskItem>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const task = mockTasks.find((t) => t.taskNo === taskNo);

  if (!task) {
    return {
      code: 404,
      message: `任务 ${taskNo} 不存在`,
      data: null as unknown as TaskItem,
    };
  }

  return {
    code: 200,
    message: '获取任务详情成功',
    data: { ...task },
  };
}

export async function updateTask(
  taskNo: string,
  data: Partial<{
    status: string;
    statusName: string;
    doneQty: number;
    assignee: string;
  }>
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const task = mockTasks.find((t) => t.taskNo === taskNo);

  if (!task) {
    return {
      code: 404,
      message: `任务 ${taskNo} 不存在`,
      data: null,
    };
  }

  if (data.status) {
    task.status = data.status as TaskItem['status'];
  }
  if (data.statusName) {
    task.statusName = data.statusName;
  }
  if (data.doneQty !== undefined) {
    task.doneQty = data.doneQty;
  }
  if (data.assignee !== undefined) {
    task.assignee = data.assignee;
  }

  return {
    code: 200,
    message: '更新任务成功',
    data: null,
  };
}
