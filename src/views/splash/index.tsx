import {useEffect} from 'react';
import {View} from 'react-native';
import BootSplash from 'react-native-bootsplash';

export function SplashSceen() {
  useEffect(() => {
    async function boot() {
      await BootSplash.hide();
    }

    boot();
  }, []);

  return <View />;
}
