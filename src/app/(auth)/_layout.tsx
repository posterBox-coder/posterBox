import { Stack } from 'expo-router';

import { KycProvider } from '@/providers/kyc-provider';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

export default function AuthLayout() {
  return (
    <KycProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="kyc" />
      </Stack>
    </KycProvider>
  );
}
