import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigation';
import {ReaderSceen} from '@views/reader/index';
import {SplashSceen} from '@views/splash/index';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashSceen} />
        <Stack.Screen name="Reader" component={ReaderSceen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
