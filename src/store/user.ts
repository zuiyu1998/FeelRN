import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {USER_KEY} from './consts';
import {getSingleStorage} from '@tools/storage';

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

export const useBearStore = create<BearState>()(
  persist(
    set => ({
      bears: 0,
      increase: by => set(state => ({bears: state.bears + by})),
    }),
    {
      name: USER_KEY,
      storage: createJSONStorage(() => getSingleStorage()),
    },
  ),
);
