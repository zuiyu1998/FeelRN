import { create } from 'zustand';
import type { User, UserStore } from '../types';

const useUserStore = create<UserStore>((set) => ({
  token: null,
  user: null,

  setToken: (token: string | null) => set({ token }),
  setUser: (user: User | null) => set({ user }),
  setAuth: (token: string, user: User) => set({ token, user }),
  signOut: () => set({ token: null, user: null }),
}));

export { useUserStore };
