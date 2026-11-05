import { Image } from 'expo-image';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { PARCEL_SIZE_KEYS, PARCEL_SIZES } from '@/constants/delivery';
import Images from '@/constants/images';
import { Palette } from '@/constants/theme';
import type { ParcelSize } from '@/types';
import { formatWeightRange } from '@/utils/format';
import { useTheme } from '@/hooks/use-theme';

type ParcelSizePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
};

export default function ParcelSizePicker<T extends FieldValues>({
  name,
  control,
  label = 'Parcel weight',
}: ParcelSizePickerProps<T>) {
  const theme = useTheme();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <View style={styles.wrap}>
      <Typography size={14} weight="500">
        {label}
      </Typography>
      <View style={styles.row}>
        {PARCEL_SIZE_KEYS.map((size) => {
          const meta = PARCEL_SIZES[size];
          const selected = value === size;
          return (
            <Pressable
              key={size}
              onPress={() => onChange(size as ParcelSize)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.card,
                {
                  borderColor: selected ? theme.primary : theme.borderColor,
                  backgroundColor: selected ? Palette.kycCard : theme.background,
                },
              ]}>
              <Image source={Images.packageBox} style={{ width: meta.iconSize + 18, height: meta.iconSize + 18 }} contentFit="contain" />
              <Typography size={13} weight="600">
                {meta.label}
              </Typography>
              <Typography size={11} textType="text3">
                {formatWeightRange(meta.weightRangeKg)}
              </Typography>
            </Pressable>
          );
        })}
      </View>
      {error?.message ? (
        <Typography size={12} color={Palette.error}>
          {error.message}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
});
