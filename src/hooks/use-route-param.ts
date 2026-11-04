import { useLocalSearchParams } from 'expo-router';

export function useRouteParam(key: string) {
  const params = useLocalSearchParams();
  const value = (params as Record<string, string | string[] | undefined>)[key];
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
