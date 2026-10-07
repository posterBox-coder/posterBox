import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import { emailRules, mockRequest, passwordRules, requiredField } from '@/helpers/auth';

type RegisterForm = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setError, getValues } = useForm<RegisterForm>({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async ({ email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    try {
      setIsSubmitting(true);
      await mockRequest();
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email, purpose: 'register' },
      });
    } catch {
      setError('email', { message: 'Unable to create account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthScreen
      footer={
        <AppButton
          title="Next"
          handlePress={onSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      }>
      <AuthHeader
        title="welcome"
        subtitle="create your account or"
        actionLabel="login"
        onActionPress={() => router.push('/(auth)/login')}
        style={{ marginTop: 28 }}
      />

      <View style={styles.fields}>
        <Input name="fullName" control={control} label="Full Name" rules={requiredField('Full name')} />
        <Input
          name="phone"
          control={control}
          label="Mobile Number"
          keyboardType="phone-pad"
          rules={requiredField('Mobile number')}
        />
        <Input
          name="email"
          control={control}
          label="Email"
          autoCapitalize="none"
          rules={emailRules}
        />
        <Input name="password" control={control} label="Password" isPassword rules={passwordRules} />
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
  },
});
