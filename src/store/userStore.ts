import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { mockUsers, mockPasswords, generateMockToken } from '@/mock/users';

interface UserState {
  currentUser: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      token: null,
      isLoggedIn: false,

      login: async (username: string, password: string) => {
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 400));

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
          return { success: false, message: '请输入用户名和密码' };
        }

        const expectedPassword = mockPasswords[trimmedUsername];

        if (!expectedPassword) {
          return { success: false, message: '用户名或密码错误' };
        }

        if (trimmedPassword !== expectedPassword) {
          return { success: false, message: '用户名或密码错误' };
        }

        const user = mockUsers.find((u) => u.username === trimmedUsername);

        if (!user) {
          return { success: false, message: '用户不存在' };
        }

        const token = generateMockToken(user);

        set({
          currentUser: user,
          token,
          isLoggedIn: true,
        });

        return { success: true, message: '登录成功' };
      },

      logout: () => {
        set({
          currentUser: null,
          token: null,
          isLoggedIn: false,
        });
      },

      setCurrentUser: (user: User) => {
        set({
          currentUser: user,
          isLoggedIn: true,
        });
      },
    }),
    {
      name: 'vita-pda-user',
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
