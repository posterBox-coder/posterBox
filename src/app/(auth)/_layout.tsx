import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
