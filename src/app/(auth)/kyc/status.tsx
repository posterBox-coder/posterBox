import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import KycInfoCard from '@/components/shared/kyc/KycInfoCard';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useKyc } from '@/providers/kyc-provider';

export default function KycStatus() {
  const { idDetails, status, submittedAt } = useKyc();
  const isVerified = status === 'verified';
  const dateLabel = submittedAt ?? '—';

  return (
    <AuthScreen
      footer={
        <AppButton title="Done" handlePress={() => router.replace('/(auth)/login')} />
      }>
      <Typography size={18} weight="600" align="center" style={styles.navTitle}>
        KYC Status
      </Typography>

      <View style={styles.hero}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isVerified ? Palette.success : Palette.kycPending },
          ]}>
          {isVerified ? (
            <Icon name="check-line" size={40} color="#111" />
          ) : (
            <View style={styles.dots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          )}
        </View>
      </View>

      <AuthHeader
        title={isVerified ? 'KYC Verified' : 'Verification Pending'}
        subtitle={
          isVerified
            ? 'your identity has been successfully verified'
            : "your KYC is currently under review we will notify you once it's approved"
        }
        style={styles.header}
      />

      <View style={styles.cards}>
        <KycInfoCard
          lines={[
            `Name: ${idDetails.fullName || '—'}`,
            `NIN: ${idDetails.idNumber || '—'}`,
          ]}
        />
        <KycInfoCard
          lines={
            isVerified
              ? ['Selfie Match: Passed', `Verified On: ${dateLabel}`]
              : ['Selfie Match: Awaiting Review', `Submitted On: ${dateLabel}`]
          }
        />
        <KycInfoCard
          variant="note"
          lines={
            isVerified
              ? ['Note: All Your Data Are Securely Encrypted']
              : ['Note: Verification Takes Up To 24hrs']
          }
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  navTitle: {
    marginBottom: 24,
    marginTop: 8,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 56,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    backgroundColor: '#111',
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  header: {
    width: '80%',
    alignSelf: 'center',
  },
  cards: {
    gap: 12,
  },
});
