import AnimatedSplash from '@/components/utilities/AnimatedSplash';
import { useTheme } from '@/hooks/use-theme';
import { KycProvider } from '@/providers/kyc-provider';
import { QueryProvider } from '@/providers/query-provider';
import { SessionProvider, useSession } from '@/providers/session-provider';
import { AppThemeProvider, useAppTheme } from '@/providers/theme-provider';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
    <GestureHandlerRootView style={styles.root}>
      <AppThemeProvider>
        <QueryProvider>
          <SessionProvider>
            <KycProvider>
              <RootNavigator splashVisible={splashVisible} onSplashComplete={handleSplashComplete} />
            </KycProvider>
          </SessionProvider>
        </QueryProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
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
  const theme = useTheme();
  const { session, isLoading: isSessionLoading } = useSession();
  const appReady = isReady && !isSessionLoading;
  const headerStatusBar = {
    statusBarTranslucent: true,
    statusBarStyle: 'light' as const,
    statusBarBackgroundColor: theme.primary,
  };

  return (
    <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <KeyboardProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Protected guard={!session}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" options={headerStatusBar} />
            <Stack.Screen name="(home)" options={headerStatusBar} />
          </Stack.Protected>
        </Stack>
      </KeyboardProvider>
      <StatusBar style={splashVisible || mode === 'dark' ? 'light' : 'dark'} />
      {splashVisible ? (
        <AnimatedSplash isAppReady={appReady} onAnimationComplete={onSplashComplete} />
      ) : null}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
