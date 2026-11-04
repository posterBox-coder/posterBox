import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { Fonts, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TrackDeliveryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ trackingNo?: string }>();
  const [trackingNo, setTrackingNo] = useState(params.trackingNo ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTrack = () => {
    const code = trackingNo.trim();
    if (!code) {
      setError('Enter a tracking number to continue.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    router.push({
      pathname: '/(home)/track-details',
      params: { trackingNo: code },
    });
    setIsSubmitting(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Track Delivery" />
      <View style={styles.body}>
        <TextInput
          value={trackingNo}
          onChangeText={(value) => {
            setTrackingNo(value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Enter Tracking Number"
          placeholderTextColor={theme.muted}
          autoCapitalize="characters"
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: error ? Palette.error : theme.borderColor,
              backgroundColor: theme.background,
            },
          ]}
        />
        {error ? (
          <Typography size={12} color={Palette.error} style={styles.helper}>
            {error}
          </Typography>
        ) : (
          <Typography size={14} textType="text2" style={styles.helper}>
            Input the tracking number of your delivery. Try AKS-1234567890
          </Typography>
        )}
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <AppButton title="Track" handlePress={handleTrack} isLoading={isSubmitting} disabled={isSubmitting} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  input: {
    borderRadius: 24,
    borderWidth: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    height: 52,
    paddingHorizontal: 18,
  },
  helper: {
    marginTop: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
});
