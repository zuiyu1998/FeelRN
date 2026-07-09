import { create } from 'zustand';
import type { User, UserStore } from '../types';

const useUserStore = create<UserStore>((set) => ({
  token: '',
  user: null,

  setToken: (token: string) => set({ token }),
  setUser: (user: User | null) => set({ user }),
  setAuth: (token: string, user: User) => set({ token, user }),
  signOut: () => set({ token: '', user: null }),
}));

export { useUserStore };
