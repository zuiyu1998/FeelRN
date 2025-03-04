import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {USER_KEY} from '../consts';
import {getSingleStorage} from '@tools/storage';
import {Store} from '../types';

interface UserState {
  token: string | undefined;
  setToken: (newToken: string | undefined) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      token: undefined,
      setToken: newToken => set(() => ({token: newToken})),
    }),
    {
      name: USER_KEY,
      storage: createJSONStorage(() => getSingleStorage()),
    },
  ),
);

export const userStore: Store = {
  async ensureInitialization() {
    await useUserStore.persist.rehydrate();
  },
};

export function getToken() {
  return useUserStore.getState().token;
}
