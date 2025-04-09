/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Router} from 'src/router';

import {ApplicationProvider} from '@components/Application';

function App(): React.JSX.Element {
  return (
    <ApplicationProvider>
      <Router />
    </ApplicationProvider>
  );
}

export default App;
