import { router } from 'expo-router';
import { useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import KycActionCard from '@/components/shared/kyc/KycActionCard';
import AppButton from '@/components/ui/AppButton';
import TopHeader from '@/components/ui/TopHeader';
import Typography from '@/components/ui/Typography';
import { Icons } from '@/constants/icons';
import { Palette } from '@/constants/theme';
import { useKyc } from '@/providers/kyc-provider';

export default function KycVerification() {
  const { isIdComplete, isSelfieComplete, submitForReview } = useKyc();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goToLogin = () => router.replace('/(auth)/login');

  const handleContinue = async () => {
    if (!isIdComplete || !isSelfieComplete) {
      setError('Complete both steps before continuing, or skip for now.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitForReview();
      router.push('/(auth)/kyc/status');
    } catch {
      setError('Unable to submit KYC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen
      footer={
        <View style={styles.footer}>
          <AppButton
            title="Continue"
            handlePress={handleContinue}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
          <AppButton title="skip" variant="secondary" handlePress={goToLogin} />
        </View>
      }>
      <TopHeader title="KYC Verification" routeTo={goToLogin} />
      <AuthHeader
        title="KYC Verification"
        subtitle="please submit the following documents to process your application"
        style={styles.header}
      />

      <View style={styles.cards}>
        <KycActionCard
          image={Icons.image2Line as ImageSourcePropType}
         
          title="Upload Your Valid ID"
          subtitle="to check your personal informations are correct"
          completed={isIdComplete}
          onPress={() => router.push('/(auth)/kyc/upload-id')}
          imgStyle={{ width: 26, height: 20, marginTop: 5 }}
        />
        <KycActionCard
          image={Icons.cameraLine as ImageSourcePropType}
          title="Take A Picture Of Yourself"
          subtitle="to match you to your passport or ID photo"
          completed={isSelfieComplete}
          onPress={() => router.push('/(auth)/kyc/selfie')}
          imgStyle={{ width: 32, height: 32 }}
        />
      </View>
      {error ? (
        <Typography size={12} color={Palette.error} align="center" style={styles.error}>
          {error}
        </Typography>
      ) : null}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 28,
    width: '80%',
    alignSelf: 'center',
  },
  cards: {
    gap: 16,
  },
  footer: {
    gap: 12,
  },
  error: {
    marginTop: 16,
  },
});
