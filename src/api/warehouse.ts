import type { ApiResponse, Warehouse } from '@/types';
import { mockWarehouses } from '@/mock/warehouses';

export async function getWarehouses(): Promise<ApiResponse<Warehouse[]>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    code: 200,
    message: '获取仓库列表成功',
    data: mockWarehouses.map((w) => ({ ...w })),
  };
}
