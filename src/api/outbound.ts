import type { ApiResponse, PickingTask } from '@/types';
import { mockPickingTasks } from '@/mock/outbound';

export async function getPickingTasks(): Promise<ApiResponse<PickingTask[]>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    code: 200,
    message: '获取拣货任务列表成功',
    data: mockPickingTasks.map((task) => ({
      ...task,
      items: task.items.map((item) => ({ ...item })),
    })),
  };
}

export async function submitPicking(
  taskNo: string,
  data: {
    items: Array<{
      id: string;
      pickedQty: number;
      locationCode: string;
    }>;
  }
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const task = mockPickingTasks.find((t) => t.taskNo === taskNo);

  if (!task) {
    return {
      code: 404,
      message: `拣货任务 ${taskNo} 不存在`,
      data: null,
    };
  }

  let totalPicked = 0;
  let totalPlan = 0;
  for (const submitted of data.items) {
    const item = task.items.find((i) => i.id === submitted.id);
    if (item) {
      item.pickedQty += submitted.pickedQty;
      item.waitQty = Math.max(0, item.planQty - item.pickedQty);
      item.status = item.pickedQty >= item.planQty ? 'completed' : 'partial';
      totalPicked += item.pickedQty;
      totalPlan += item.planQty;
    }
  }

  task.status = totalPlan > 0 && totalPicked >= totalPlan ? 'completed' : 'in_progress';
  task.progress =
    totalPlan > 0 ? `${Math.round((totalPicked / totalPlan) * 100)}%` : '0%';

  return {
    code: 200,
    message: '拣货提交成功',
    data: null,
  };
}

export async function submitSorting(
  taskNo: string,
  data: {
    items: Array<{
      id: string;
      sortedQty: number;
      slotNo: string;
    }>;
  }
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    code: 200,
    message: '分播提交成功',
    data: null,
  };
}

export async function submitRecheck(
  taskNo: string,
  data: {
    items: Array<{
      id: string;
      checkedQty: number;
      diffType?: string;
    }>;
  }
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    code: 200,
    message: '复核提交成功',
    data: null,
  };
}

export async function submitPacking(
  taskNo: string,
  data: {
    boxNo: string;
    items: Array<{
      id: string;
      packedQty: number;
    }>;
  }
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    code: 200,
    message: '打包提交成功',
    data: null,
  };
}

export async function submitWeighing(
  boxNo: string,
  weight: number
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (weight <= 0) {
    return {
      code: 400,
      message: '称重数据无效，请重新称重',
      data: null,
    };
  }

  return {
    code: 200,
    message: `箱号 ${boxNo} 称重成功，重量 ${weight}kg`,
    data: null,
  };
}

export async function submitShip(
  taskNo: string,
  data: {
    boxes: Array<{
      boxNo: string;
      scanned: boolean;
    }>;
  }
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const scannedCount = data.boxes.filter((b) => b.scanned).length;

  return {
    code: 200,
    message: `发运提交成功，已扫描 ${scannedCount} 箱`,
    data: null,
  };
}
