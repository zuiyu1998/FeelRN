import { create } from 'zustand';
import type { AppStore } from '../types';

const useAppStore = create<AppStore>((set) => ({
  loading: true,
  finishLoading: () => set({ loading: false }),
}));

export { useAppStore };
