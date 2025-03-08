import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigation';
import {ReaderSceen} from '@views/reader';

export function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <ReaderSceen />
    </NavigationContainer>
  );
}
