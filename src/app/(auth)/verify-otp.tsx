import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { OtpInputRef } from 'react-native-otp-entry';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import AppButton from '@/components/ui/AppButton';
import OtpInput from '@/components/ui/OtpInput';
import TopHeader from '@/components/ui/TopHeader';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import {
  DEMO_OTP,
  formatCountdown,
  isOtpPurpose,
  mockRequest,
  mockVerifyOtp,
  OTP_LENGTH,
  RESEND_SECONDS,
  type OtpPurpose,
} from '@/helpers/auth';
import { useTheme } from '@/hooks/use-theme';

export default function VerifyOtp() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ email?: string; purpose?: string }>();
  const email = params.email ?? '';
  const purpose: OtpPurpose = isOtpPurpose(params.purpose) ? params.purpose : 'register';

  const otpRef = useRef<OtpInputRef>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleVerify = async () => {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await mockVerifyOtp(code);

      if (purpose === 'reset') {
        router.replace({
          pathname: '/(auth)/reset-password',
          params: { email },
        });
        return;
      }

      router.replace('/(auth)/kyc');
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Verification failed');
      otpRef.current?.clear();
      setCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) {
      return;
    }

    await mockRequest();
    otpRef.current?.clear();
    setCode('');
    setError(null);
    setSecondsLeft(RESEND_SECONDS);
  };

  return (
    <AuthScreen
      footer={
        <AppButton
          title="Next"
          handlePress={handleVerify}
          isLoading={isSubmitting}
          disabled={isSubmitting || code.length !== OTP_LENGTH}
        />
      }>
      <TopHeader title="OTP Verification" />
      <AuthHeader
        style={{ marginTop: 28, width: "70%", alignSelf: "center" }}
        subtitle={
          email
            ? `Enter the ${OTP_LENGTH}-digit code sent to ${email}`
            : `Enter the ${OTP_LENGTH}-digit code sent to your email`
        }
      />

      <View style={styles.content}>
        <OtpInput inputRef={otpRef} onTextChange={setCode} hasError={Boolean(error)} />
        {error ? (
          <Typography size={12} align="center" color={Palette.error} lineHeight={16}>
            {error}
          </Typography>
        ) : (
          <Typography size={12} align="center" textType="text2" lineHeight={16}>
            test code: {DEMO_OTP}
          </Typography>
        )}

<Pressable onPress={handleResend} disabled={secondsLeft > 0} style={styles.resend}>
  <Typography size={14} align="center" textType="text2" lineHeight={20}>
    Didn’t get the code?{' '}
    {secondsLeft > 0 ? (
      <>
        <Typography size={14} weight="500" color={theme.text2}>
          Resend in{' '}
        </Typography>
        <Typography size={14} weight="500" color={theme.primary}>
          {formatCountdown(secondsLeft)}s
        </Typography>
      </>
    ) : (
      <Typography size={14} weight="500" color={theme.primary}>
        Resend
      </Typography>
    )}
  </Typography>
</Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    marginTop: 8,
  },
  resend: {
    marginTop: 4,
  },
});
