import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Appearance } from 'react-native';

import { Colors } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@posterbox/theme';

type AppThemeContextValue = {
  mode: ThemeMode;
  colors: (typeof Colors)[ThemeMode];
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isReady: boolean;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function applyNativeScheme(mode: ThemeMode) {
  Appearance.setColorScheme(mode);
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    applyNativeScheme('light');

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (cancelled) {
          return;
        }
        const nextMode = stored === 'dark' ? 'dark' : 'light';
        setModeState(nextMode);
        applyNativeScheme(nextMode);
      })
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    applyNativeScheme(nextMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      colors: Colors[mode],
      setMode,
      toggleTheme,
      isReady,
    }),
    [mode, setMode, toggleTheme, isReady]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
}
