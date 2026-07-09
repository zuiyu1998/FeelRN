import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore } from '../store/appStore';

function SplashScreen() {
  const finishLoading = useAppStore((state) => state.finishLoading);

  useEffect(() => {
    const timer = setTimeout(finishLoading, 2000);
    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FeelRN</Text>
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
