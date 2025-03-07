/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Router} from 'src/router';

import {PaperProvider} from 'react-native-paper';
import {useTheme} from '@theme/hooks';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const theme = useTheme();

  return (
    <GestureHandlerRootView>
      <PaperProvider theme={theme}>
        <Router />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
