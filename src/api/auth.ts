import type { ApiResponse, User } from '@/types';
import { mockUsers, mockPasswords, generateMockToken } from '@/mock/users';

export async function loginApi(
  username: string,
  password: string
): Promise<ApiResponse<User>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedUsername || !trimmedPassword) {
    return {
      code: 400,
      message: '请输入用户名和密码',
      data: null as unknown as User,
    };
  }

  const expectedPassword = mockPasswords[trimmedUsername];

  if (!expectedPassword || trimmedPassword !== expectedPassword) {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null as unknown as User,
    };
  }

  const user = mockUsers.find((u) => u.username === trimmedUsername);

  if (!user) {
    return {
      code: 404,
      message: '用户不存在',
      data: null as unknown as User,
    };
  }

  return {
    code: 200,
    message: '登录成功',
    data: { ...user, permissions: [...user.permissions] },
  };
}

export async function registerApi(params: {
  username: string;
  password: string;
  name: string;
  phone: string;
  role: string;
}): Promise<ApiResponse<null>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { username } = params;

  if (!username || !params.password || !params.name) {
    return {
      code: 400,
      message: '必填字段不能为空',
      data: null,
    };
  }

  const existingUser = mockUsers.find((u) => u.username === username);

  if (existingUser) {
    return {
      code: 409,
      message: '用户名已存在',
      data: null,
    };
  }

  return {
    code: 200,
    message: '注册成功',
    data: null,
  };
}
