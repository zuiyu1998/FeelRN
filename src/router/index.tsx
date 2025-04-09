import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ReaderSceen} from '@views/reader/index';
import {ChatSceen} from '@views/chat/index';

const Stack = createNativeStackNavigator();

export function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Chat" component={ChatSceen} />
        <Stack.Screen name="Reader" component={ReaderSceen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
