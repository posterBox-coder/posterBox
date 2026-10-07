import AnimatedSplash from '@/components/utilities/AnimatedSplash';
import { AppThemeProvider, useAppTheme } from '@/providers/theme-provider';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Thin': require('../../assets/fonts/Inter_18pt-Thin.ttf'),
    'Inter-ExtraLight': require('../../assets/fonts/Inter_18pt-ExtraLight.ttf'),
    'Inter-Light': require('../../assets/fonts/Inter_18pt-Light.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter_18pt-ExtraBold.ttf'),
    'Inter-Black': require('../../assets/fonts/Inter_18pt-Black.ttf'),
    'Inter-Italic': require('../../assets/fonts/Inter_18pt-Italic.ttf'),
  });
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  const handleSplashComplete = useCallback(() => {
    setSplashVisible(false);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppThemeProvider>
      <RootNavigator splashVisible={splashVisible} onSplashComplete={handleSplashComplete} />
    </AppThemeProvider>
  );
}

function RootNavigator({
  splashVisible,
  onSplashComplete,
}: {
  splashVisible: boolean;
  onSplashComplete: () => void;
}) {
  const { mode, isReady } = useAppTheme();

  return (
    <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <KeyboardProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </KeyboardProvider>
      <StatusBar style={splashVisible || mode === 'dark' ? 'light' : 'dark'} />
      {splashVisible ? (
        <AnimatedSplash isAppReady={isReady} onAnimationComplete={onSplashComplete} />
      ) : null}
    </ThemeProvider>
  );
}
