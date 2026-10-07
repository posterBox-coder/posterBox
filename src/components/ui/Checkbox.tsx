import ExpoCheckbox from 'expo-checkbox';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type CustomCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

export default function CustomCheckbox<T extends FieldValues>({
  control,
  name,
  label,
}: CustomCheckboxProps<T>) {
  const theme = useTheme();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <View>
      <Pressable style={styles.row} onPress={() => onChange(!value)}>
        <ExpoCheckbox
          style={styles.checkbox}
          value={Boolean(value)}
          onValueChange={onChange}
          color={value ? theme.primary : undefined}
        />
        {label ? (
          <Typography size={14} weight="400" lineHeight={20}>
            {label}
          </Typography>
        ) : null}
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  checkbox: {
    borderRadius: 3,
    height: 17,
    marginVertical: 8,
    width: 17,
  },
});
