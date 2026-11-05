import * as ImagePicker from 'expo-image-picker';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { capturePhoto, chooseImageSource, pickFromLibrary } from '@/helpers/media';
import { useTheme } from '@/hooks/use-theme';

type ImageUploadFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  rules?: object;
};

export default function ImageUploadField<T extends FieldValues>({
  name,
  control,
  label,
  rules,
}: ImageUploadFieldProps<T>) {
  const theme = useTheme();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, rules });

  const handlePick = () => {
    chooseImageSource({
      camera: async () => {
        const uri = await capturePhoto({
          aspect: [4, 3],
          cameraType: ImagePicker.CameraType.back,
        });
        if (uri) {
          onChange(uri);
        }
      },
      library: async () => {
        const uri = await pickFromLibrary({ aspect: [4, 3] });
        if (uri) {
          onChange(uri);
        }
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <Typography size={14} weight="500" lineHeight={20}>
        {label}
      </Typography>
      <Pressable
        onPress={handlePick}
        style={[
          styles.box,
          { borderColor: error ? Palette.error : theme.borderColor, backgroundColor: theme.background },
        ]}>
        {value ? (
          <Image source={{ uri: value }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.plus}>
            <Typography size={28} weight="400" color={theme.text} lineHeight={32}>
              +
            </Typography>
          </View>
        )}
      </Pressable>
      {error?.message ? (
        <Typography size={12} lineHeight={16} color={Palette.error}>
          {error.message}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    width: '100%',
  },
  box: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 160,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: {
    height: '100%',
    width: '100%',
  },
  plus: {
    alignItems: 'center',
    backgroundColor: Palette.avatarMuted,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
});
