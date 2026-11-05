import { Stack } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

export default function HomeStackLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarTranslucent: true,
        statusBarStyle: 'light',
        statusBarBackgroundColor: theme.primary,
      }}>
      <Stack.Screen name="notifications" />
      <Stack.Screen name="track" />
      <Stack.Screen name="track-details" />
      <Stack.Screen name="send-package" />
      <Stack.Screen name="find-traveler" />
      <Stack.Screen name="request-details" />
      <Stack.Screen name="payment-success" />
      <Stack.Screen name="tracking-code" />
      <Stack.Screen name="do-delivery" />
      <Stack.Screen name="payout-account" />
      <Stack.Screen name="delivery/[id]" />
      <Stack.Screen name="ongoing-delivery" />
      <Stack.Screen name="confirm-delivery" />
      <Stack.Screen name="delivered" />
      <Stack.Screen name="delivery-rate" />
      <Stack.Screen name="contact-support" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="card-settings" />
      <Stack.Screen name="update-kyc" />
      <Stack.Screen name="upload-selfie" />
      <Stack.Screen name="enter-delivery-code" />
    </Stack>
  );
}
