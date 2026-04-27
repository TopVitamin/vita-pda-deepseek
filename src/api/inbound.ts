import type { ApiResponse, InboundDoc } from '@/types';
import { mockInboundDocs } from '@/mock/documents';
import { mockQcTasks, mockPutawayTasks } from '@/mock/inbound';

export async function getInboundDocs(): Promise<ApiResponse<InboundDoc[]>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    code: 200,
    message: '获取入库单列表成功',
    data: mockInboundDocs.map((doc) => ({
      ...doc,
      items: doc.items.map((item) => ({ ...item })),
    })),
  };
}

export async function getInboundDocByNo(
  docNo: string
): Promise<ApiResponse<InboundDoc>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const doc = mockInboundDocs.find((d) => d.docNo === docNo);

  if (!doc) {
    return {
      code: 404,
      message: `入库单 ${docNo} 不存在`,
      data: null as unknown as InboundDoc,
    };
  }

  return {
    code: 200,
    message: '获取入库单详情成功',
    data: {
      ...doc,
      items: doc.items.map((item) => ({ ...item })),
    },
  };
}

export async function submitReceive(
  docNo: string,
  items: Array<{
    id: string;
    receivedQty: number;
  }>
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const doc = mockInboundDocs.find((d) => d.docNo === docNo);

  if (!doc) {
    return {
      code: 404,
      message: `入库单 ${docNo} 不存在`,
      data: null,
    };
  }

  for (const submitted of items) {
    const item = doc.items.find((i) => i.id === submitted.id);
    if (item) {
      item.receivedQty += submitted.receivedQty;
      item.waitQty = Math.max(0, item.planQty - item.receivedQty);
    }
  }

  return {
    code: 200,
    message: '收货提交成功',
    data: null,
  };
}

export async function submitQc(
  taskNo: string,
  items: Array<{
    id: string;
    result: string;
    exceptionReason?: string;
  }>
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const qcTask = mockQcTasks.find((t) => t.taskNo === taskNo);

  if (!qcTask) {
    return {
      code: 404,
      message: `质检任务 ${taskNo} 不存在`,
      data: null,
    };
  }

  let passedCount = 0;
  for (const submitted of items) {
    const qcItem = qcTask.items.find((i) => i.id === submitted.id);
    if (qcItem) {
      qcItem.result = submitted.result;
      if (submitted.exceptionReason) {
        qcItem.exceptionReason = submitted.exceptionReason;
      }
      if (submitted.result === '合格') {
        passedCount += qcItem.qcQty;
      }
    }
  }

  qcTask.doneQcQty += passedCount;
  qcTask.waitQcQty = Math.max(0, qcTask.waitQcQty - passedCount);

  return {
    code: 200,
    message: '质检提交成功',
    data: null,
  };
}

export async function submitPutaway(
  taskNo: string,
  items: Array<{
    id: string;
    doneQty: number;
    targetLocation: string;
  }>
): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const putawayTask = mockPutawayTasks.find((t) => t.taskNo === taskNo);

  if (!putawayTask) {
    return {
      code: 404,
      message: `上架任务 ${taskNo} 不存在`,
      data: null,
    };
  }

  let totalDone = 0;
  for (const submitted of items) {
    const item = putawayTask.items.find((i) => i.id === submitted.id);
    if (item) {
      item.doneQty += submitted.doneQty;
      item.waitQty = Math.max(0, item.planQty - item.doneQty);
      item.targetLocation = submitted.targetLocation;
      totalDone += submitted.doneQty;
    }
  }

  putawayTask.doneQty += totalDone;
  putawayTask.waitQty = Math.max(0, putawayTask.waitQty - totalDone);

  return {
    code: 200,
    message: '上架提交成功',
    data: null,
  };
}
