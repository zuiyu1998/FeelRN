import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigation';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home() {
  return <View />;
}

export function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Screen name="Home" component={Home} />
    </NavigationContainer>
  );
}
