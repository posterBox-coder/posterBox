import { Redirect } from 'expo-router';

import { useSession } from '@/providers/session-provider';

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
