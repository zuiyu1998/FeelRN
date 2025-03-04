import {useThemeStore} from '@store/module/theme';
import React from 'react';

export function useTheme() {
  const themeStore = useThemeStore();

  const theme = React.useMemo(() => {
    return themeStore.theme;
  }, [themeStore]);
  return theme;
}
