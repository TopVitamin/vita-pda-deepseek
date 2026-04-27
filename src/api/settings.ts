import type { ApiResponse, SystemParams } from '@/types';
import { defaultSystemParams } from '@/mock/settings';

let serverParams: SystemParams = { ...defaultSystemParams };

export async function getSystemParams(): Promise<ApiResponse<SystemParams>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    code: 200,
    message: '获取系统参数成功',
    data: { ...serverParams },
  };
}

export async function updateSystemParams(
  params: Partial<SystemParams>
): Promise<ApiResponse<SystemParams>> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  serverParams = { ...serverParams, ...params };

  return {
    code: 200,
    message: '系统参数更新成功',
    data: { ...serverParams },
  };
}

export async function resetSystemParams(): Promise<ApiResponse<SystemParams>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  serverParams = { ...defaultSystemParams };

  return {
    code: 200,
    message: '系统参数已重置为默认值',
    data: { ...serverParams },
  };
}
