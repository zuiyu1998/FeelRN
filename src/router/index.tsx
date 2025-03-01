import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigation';
import {View} from 'react-native';

function Home() {
  return <View />;
}

export function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Home />
    </NavigationContainer>
  );
}
