import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SystemParams } from '@/types';

const DEFAULT_PARAMS: SystemParams = {
  autoSubmitAfterScan: false,
  soundEnabled: true,
  vibrateEnabled: true,
  defaultQtyOne: true,
  autoFocusNext: true,
  showSensitiveStock: false,
  pageSize: 20,
};

interface SettingsState {
  params: SystemParams;
  updateParams: (partial: Partial<SystemParams>) => void;
  resetParams: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      params: { ...DEFAULT_PARAMS },

      updateParams: (partial: Partial<SystemParams>) => {
        set((state) => ({
          params: { ...state.params, ...partial },
        }));
      },

      resetParams: () => {
        set({ params: { ...DEFAULT_PARAMS } });
      },
    }),
    {
      name: 'vita-pda-settings',
    }
  )
);
