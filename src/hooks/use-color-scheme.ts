import { useAppTheme } from '@/providers/theme-provider';

/** In-app theme only. Does not follow the device light/dark setting. */
export function useColorScheme() {
  return useAppTheme().mode;
}
