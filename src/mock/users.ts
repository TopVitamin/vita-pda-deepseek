import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    userId: 'U001',
    username: 'admin',
    name: '管理员',
    phone: '13800000001',
    role: '系统管理员',
    warehouseIds: ['WH001', 'WH002', 'WH003', 'WH004', 'WH005', 'WH006'],
    permissions: [
      'dashboard:view',
      'inbound:manage',
      'outbound:manage',
      'inventory:manage',
      'task:manage',
      'counting:manage',
      'exception:manage',
      'report:view',
      'system:manage',
      'user:manage',
    ],
  },
  {
    userId: 'U002',
    username: 'picker',
    name: '张拣货',
    phone: '13800000002',
    role: '拣货员',
    warehouseIds: ['WH001', 'WH002', 'WH003'],
    permissions: [
      'task:view',
      'picking:execute',
      'picking:scan',
      'outbound:view',
    ],
  },
  {
    userId: 'U003',
    username: 'receiver',
    name: '李收货',
    phone: '13800000003',
    role: '收货员',
    warehouseIds: ['WH001', 'WH002', 'WH004', 'WH005', 'WH006'],
    permissions: [
      'task:view',
      'receive:execute',
      'receive:scan',
      'qc:execute',
      'putaway:execute',
      'inbound:view',
    ],
  },
  {
    userId: 'U004',
    username: 'checker',
    name: '王复核',
    phone: '13800000004',
    role: '复核员',
    warehouseIds: ['WH001', 'WH002', 'WH003'],
    permissions: [
      'task:view',
      'recheck:execute',
      'recheck:scan',
      'packing:execute',
      'outbound:view',
    ],
  },
  {
    userId: 'U005',
    username: 'packer',
    name: '赵装箱',
    phone: '13800000005',
    role: '装箱员',
    warehouseIds: ['WH001', 'WH002'],
    permissions: [
      'task:view',
      'packing:execute',
      'weighing:execute',
      'ship:execute',
      'outbound:view',
    ],
  },
  {
    userId: 'U006',
    username: 'qc',
    name: '孙质检',
    phone: '13800000006',
    role: '质检员',
    warehouseIds: ['WH001', 'WH002', 'WH004'],
    permissions: [
      'task:view',
      'qc:execute',
      'inbound:view',
    ],
  },
  {
    userId: 'U007',
    username: 'shipper',
    name: '周发货',
    phone: '13800000007',
    role: '发货员',
    warehouseIds: ['WH001', 'WH002', 'WH003'],
    permissions: [
      'task:view',
      'ship:execute',
      'weighing:execute',
      'outbound:view',
    ],
  },
  {
    userId: 'U008',
    username: 'counter',
    name: '吴盘点',
    phone: '13800000008',
    role: '盘点员',
    warehouseIds: ['WH001', 'WH002', 'WH003', 'WH004'],
    permissions: [
      'task:view',
      'counting:execute',
      'inventory:view',
    ],
  },
];

export const mockPasswords: Record<string, string> = {
  admin: '123456',
  picker: '123456',
  receiver: '123456',
  checker: '123456',
  packer: '123456',
  qc: '123456',
  shipper: '123456',
  counter: '123456',
};

function safeBtoa(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => String.fromCharCode(parseInt(p1, 16))));
}

export function generateMockToken(user: User): string {
  const header = safeBtoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = safeBtoa(
    JSON.stringify({
      userId: user.userId,
      username: user.username,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000,
      iat: Date.now(),
    })
  );
  const signature = safeBtoa(`mock-signature-${user.userId}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}
