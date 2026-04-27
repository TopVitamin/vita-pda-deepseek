import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Warehouse } from '@/types';
import { mockWarehouses } from '@/mock/warehouses';

interface WarehouseState {
  currentWarehouse: Warehouse | null;
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
  selectWarehouse: (warehouse: Warehouse) => void;
  loadWarehouses: () => Promise<void>;
  clearWarehouse: () => void;
}

export const useWarehouseStore = create<WarehouseState>()(
  persist(
    (set, get) => ({
      currentWarehouse: null,
      warehouses: [],
      loading: false,
      error: null,

      selectWarehouse: (warehouse: Warehouse) => {
        set({ currentWarehouse: warehouse });
      },

      loadWarehouses: async () => {
        const { warehouses } = get();
        // 避免重复加载
        if (warehouses.length > 0) return;

        set({ loading: true, error: null });
        try {
          // 模拟网络延迟
          await new Promise((resolve) => setTimeout(resolve, 350));
          set({
            warehouses: mockWarehouses,
            loading: false,
          });
        } catch {
          set({
            loading: false,
            error: '加载仓库列表失败，请重试',
          });
        }
      },

      clearWarehouse: () => {
        set({ currentWarehouse: null });
      },
    }),
    {
      name: 'vita-pda-warehouse',
      partialize: (state) => ({
        currentWarehouse: state.currentWarehouse,
      }),
    }
  )
);
