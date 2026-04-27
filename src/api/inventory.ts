import type { ApiResponse, InventoryRecord, InventoryFlow } from '@/types';
import {
  mockInventoryRecords,
  mockInventoryFlows,
} from '@/mock/inventory';

export async function queryInventory(
  params: Partial<{
    productCode: string;
    productName: string;
    locationCode: string;
    batchNo: string;
    warehouseCode: string;
    page: number;
    pageSize: number;
  }>
): Promise<ApiResponse<InventoryRecord[]>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filtered = [...mockInventoryRecords];

  if (params.productCode) {
    filtered = filtered.filter((r) =>
      r.productCode.includes(params.productCode!)
    );
  }
  if (params.productName) {
    filtered = filtered.filter((r) =>
      r.productName.includes(params.productName!)
    );
  }
  if (params.locationCode) {
    filtered = filtered.filter((r) =>
      r.locationCode.includes(params.locationCode!)
    );
  }
  if (params.batchNo) {
    filtered = filtered.filter((r) =>
      r.batchNo.includes(params.batchNo!)
    );
  }
  if (params.warehouseCode) {
    filtered = filtered.filter(
      (r) => r.warehouseCode === params.warehouseCode
    );
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    code: 200,
    message: '库存查询成功',
    data: paged,
  };
}

export async function getLocationInventory(
  locationCode: string
): Promise<ApiResponse<InventoryRecord[]>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const records = mockInventoryRecords.filter(
    (r) => r.locationCode === locationCode
  );

  return {
    code: 200,
    message: `库位 ${locationCode} 库存查询成功，共 ${records.length} 条记录`,
    data: records,
  };
}

export async function getProductInventory(
  productCode: string
): Promise<ApiResponse<InventoryRecord[]>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const records = mockInventoryRecords.filter(
    (r) => r.productCode === productCode
  );

  if (records.length === 0) {
    return {
      code: 404,
      message: `商品 ${productCode} 无库存记录`,
      data: [],
    };
  }

  return {
    code: 200,
    message: `商品 ${productCode} 库存查询成功，共 ${records.length} 个库位`,
    data: records,
  };
}

export async function queryFlow(
  params: Partial<{
    productCode: string;
    docNo: string;
    opType: string;
    startTime: string;
    endTime: string;
    page: number;
    pageSize: number;
  }>
): Promise<ApiResponse<InventoryFlow[]>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filtered = [...mockInventoryFlows];

  if (params.productCode) {
    filtered = filtered.filter((f) =>
      f.productCode.includes(params.productCode!)
    );
  }
  if (params.docNo) {
    filtered = filtered.filter((f) => f.docNo.includes(params.docNo!));
  }
  if (params.opType) {
    filtered = filtered.filter((f) => f.opType.includes(params.opType!));
  }
  if (params.startTime) {
    filtered = filtered.filter((f) => f.time >= params.startTime!);
  }
  if (params.endTime) {
    filtered = filtered.filter((f) => f.time <= params.endTime!);
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    code: 200,
    message: '流水查询成功',
    data: paged,
  };
}
