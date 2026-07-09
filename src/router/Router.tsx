import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { useUserStore } from '../store/userStore';
import { useAppStore } from '../store/appStore';
import { SignInContext, useIsSignedIn, useIsSignedOut } from './SignInContext';
import SplashScreen from '../screens/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  Home: undefined;
  Details: { itemId: number; title?: string };
};

const RootStack = createNativeStackNavigator({
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
  const isSignedIn = useUserStore(state => state.token) !== null;
  const loading = useAppStore(state => state.loading);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <SignInContext.Provider value={{ isSignedIn }}>
      <Navigation />
    </SignInContext.Provider>
  );
}

export default Router;
