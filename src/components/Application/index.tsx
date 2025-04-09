import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {PropsWithChildren} from 'react';
import {PaperProvider} from 'react-native-paper';
import {useTheme} from '@theme/hooks';
import {ensureStoresInitialization} from '@store/index';
import BootSplash from 'react-native-bootsplash';

export function ApplicationProvider({children}: PropsWithChildren) {
  const theme = useTheme();

  React.useEffect(() => {
    async function bootstrap() {
      await ensureStoresInitialization();
      await BootSplash.hide();
    }

    bootstrap();
  }, []);

  return (
    <GestureHandlerRootView>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </GestureHandlerRootView>
  );
}
