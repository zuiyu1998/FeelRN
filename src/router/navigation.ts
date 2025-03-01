import {createNavigationContainerRef} from '@react-navigation/native';

type RootStackParamList = {
    Home: undefined
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function getSingleNavigation() {
  if (navigationRef.isReady()) {
    return navigationRef;
  } else {
    throw Error('navigation not found');
  }
}
