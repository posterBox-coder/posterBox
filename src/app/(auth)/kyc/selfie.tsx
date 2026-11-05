import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import AuthHeader from '@/components/shared/auth/AuthHeader';
import AuthScreen from '@/components/shared/auth/AuthScreen';
import AppButton from '@/components/ui/AppButton';
import TopHeader from '@/components/ui/TopHeader';
import Typography from '@/components/ui/Typography';
import { Icons } from '@/constants/icons';
import { Palette } from '@/constants/theme';
import { capturePhoto } from '@/helpers/media';
import { useKyc } from '@/providers/kyc-provider';

export default function UploadSelfie() {
  const { selfieUri, saveSelfie } = useKyc();
  const [previewUri, setPreviewUri] = useState<string | null>(selfieUri);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCapture = async () => {
    try {
      setIsCapturing(true);
      setError(null);
      const uri = await capturePhoto({ aspect: [1, 1] });
      if (uri) {
        setPreviewUri(uri);
      }
    } catch {
      setError('Unable to open the camera. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleContinue = async () => {
    if (!previewUri) {
      setError('Capture a selfie to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      saveSelfie(previewUri);
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen
      footer={
        <AppButton
          title="Continue"
          handlePress={handleContinue}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      }>
      <TopHeader title="Upload Your Selfie" />
      <AuthHeader
        title="Take A Picture Of Yourself"
        subtitle="to match you to your passport or ID photo"
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.avatar}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={{ height: 200, width: 200 }} />
          ) : (
            <Image source={Icons.user60 as ImageSourcePropType} style={styles.avatarImage} />
          )}
        </View>

        <AppButton
          title="Capture Selfie"
          variant="tertiary"
          handlePress={handleCapture}
          isLoading={isCapturing}
          disabled={isCapturing}
          style={styles.capture}
        />
        {error ? (
          <Typography size={12} color={Palette.error} align="center">
            {error}
          </Typography>
        ) : null}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 28,
    width: '80%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
    marginTop: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.avatarBg,
    borderRadius: 100,
    height: 200,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 200,
  },
  avatarImage: {
    height: 60,
    width: 60,
  },
  capture: {
    width: '70%',
  },
});
