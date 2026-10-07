import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import TopHeader from '@/components/ui/TopHeader';
import Typography from '@/components/ui/Typography';
import { emailRules, mockRequest } from '@/helpers/auth';
import { useTheme } from '@/hooks/use-theme';

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPassword() {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setError } = useForm<ForgotPasswordForm>({
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      setIsSubmitting(true);
      await mockRequest();
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email, purpose: 'reset' },
      });
    } catch {
      setError('email', { message: 'Unable to send reset code. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthScreen
      footer={
        <View style={styles.footer}>
          <AppButton
            title="Next"
            handlePress={onSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Typography size={14} weight="400" textType="text2" align="center" lineHeight={20}>
              Remember password?{' '}
              <Typography size={14} weight="500" color={theme.primary}>
                login
              </Typography>
            </Typography>
          </Pressable>
        </View>
      }>
      <TopHeader title="Forgot Password" />
      <AuthHeader subtitle="Enter the email linked to your account and we’ll send a verification code." style={styles.header} />

      <View style={styles.fields}>
        <Input
          name="email"
          control={control}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          rules={emailRules}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
    marginTop: 8,
  },
  footer: {
    gap: 16,
  },
  header: {
    marginTop: 28,
    width: "70%",
    alignSelf: "center",
  },
});
