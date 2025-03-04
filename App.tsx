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

function App(): React.JSX.Element {
  const theme = useTheme();

  return (
    <PaperProvider theme={theme}>
      <Router />
    </PaperProvider>
  );
}

export default App;
