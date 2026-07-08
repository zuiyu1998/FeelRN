import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { SignInContext, useIsSignedIn, useIsSignedOut } from './SignInContext';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  Details: { itemId: number; title?: string };
};

const RootStack = createNativeStackNavigator({
  screens: {},
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Home: HomeScreen,
        Details: DetailsScreen,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: SignInScreen,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function Router() {
  let isSignedIn = true;

  return (
    <SignInContext.Provider value={{ isSignedIn }}>
      <Navigation />
    </SignInContext.Provider>
  );
}

export default Router;
