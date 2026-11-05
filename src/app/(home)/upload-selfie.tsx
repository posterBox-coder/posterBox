import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import FormScreen from '@/components/shared/FormScreen';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { Icons } from '@/constants/icons';
import { Palette } from '@/constants/theme';
import { capturePhoto } from '@/helpers/media';
import { useKyc } from '@/providers/kyc-provider';

export default function UploadSelfieScreen() {
  const { selfieUri, saveSelfie, markVerified } = useKyc();
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
      markVerified();
      router.navigate('/(tabs)/account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormScreen
      title="upload a selfie"
      footer={<AppButton title="Continue" handlePress={handleContinue} isLoading={isSubmitting} disabled={isSubmitting} />}>
      <View style={styles.content}>
        <Typography size={18} weight="700" align="center">
          Take A Picture Of Yourself
        </Typography>
        <Typography size={14} textType="text2" align="center" style={styles.subtitle}>
          to match you to your passport or ID photo
        </Typography>
        <View style={styles.avatar}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.preview} />
          ) : (
            <Image source={Icons.user60 as ImageSourcePropType} style={styles.placeholder} />
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
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 28,
  },
  subtitle: {
    marginTop: 8,
    width: '72%',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.avatarBg,
    borderRadius: 100,
    height: 200,
    justifyContent: 'center',
    marginTop: 36,
    overflow: 'hidden',
    width: 200,
  },
  preview: {
    height: 200,
    width: 200,
  },
  placeholder: {
    height: 64,
    width: 64,
  },
  capture: {
    alignSelf: 'center',
    marginTop: 36,
    width: '78%',
  },
});
