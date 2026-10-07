import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import AppButton from '@/components/ui/AppButton';
import CustomCheckbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { emailRules, mockRequest, passwordRules } from '@/helpers/auth';
import { useTheme } from '@/hooks/use-theme';

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setError } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = handleSubmit(async () => {
    try {
      setIsSubmitting(true);
      await mockRequest();
    } catch {
      setError('password', { message: 'Unable to log in. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthScreen
      footer={
        <AppButton title="Login" handlePress={onSubmit} isLoading={isSubmitting} disabled={isSubmitting} />
      }>
      <AuthHeader
        title="Welcome Back"
        subtitle="Don't have an account?"
        actionLabel="sign up"
        onActionPress={() => router.push('/(auth)/register')}
        style={{ marginTop: 28 }}
      />

      <View style={styles.fields}>
        <Input
          name="email"
          control={control}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          rules={emailRules}
        />
        <Input name="password" control={control} label="Password" isPassword rules={passwordRules} />

        <View style={styles.row}>
          <CustomCheckbox control={control} name="rememberMe" label="Remember me" />
          <Pressable onPress={() => router.push('/(auth)/forgot-password')} hitSlop={8}>
            <Typography size={14} weight="500" color={theme.primary} lineHeight={20}>
              Forgot Password
            </Typography>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
