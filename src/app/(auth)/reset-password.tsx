import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import TopHeader from '@/components/ui/TopHeader';
import { mockRequest, passwordRules } from '@/helpers/auth';

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setError, getValues } = useForm<ResetPasswordForm>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    try {
      setIsSubmitting(true);
      await mockRequest();
      router.replace('/(auth)/login');
    } catch {
      setError('password', { message: 'Unable to update password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthScreen
      footer={
        <AppButton
          title="Done"
          handlePress={onSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      }>
      <TopHeader title="Forgot Password" />
      <AuthHeader subtitle="Create a new password for your account." style={{ marginTop: 28, alignSelf: "center" }}/>

      <View style={styles.fields}>
        <Input
          name="password"
          control={control}
          label="Password"
          isPassword
          rules={passwordRules}
        />
        <Input
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          isPassword
          rules={{
            required: 'Confirm your password',
            validate: (value: string) =>
              value === getValues('password') || 'Passwords do not match',
          }}
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
});
