import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {THEME_KEY} from '../consts';
import {getSingleStorage} from '@tools/storage';
import {Store} from '../types';
import {themeConfig} from 'src/config/theme';
import {ThemeState} from '@theme/index';

export const useThemeStore = create<ThemeState>()(
  persist(
    () => ({
      theme: themeConfig.theme,
    }),
    {
      name: THEME_KEY,
      storage: createJSONStorage(() => getSingleStorage()),
    },
  ),
);

export const themeStore: Store = {
  async ensureInitialization() {
    await useThemeStore.persist.rehydrate();
  },
};
