import { useAppTheme } from '@/providers/theme-provider';

export function useTheme() {
  const { colors, mode, setMode, toggleTheme, isReady } = useAppTheme();

  return {
    ...colors,
    mode,
    setMode,
    toggleTheme,
    isReady,
  };
}
