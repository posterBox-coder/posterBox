import { type Control, type FieldValues, type Path, type PathValue, useController } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Fonts, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import FieldShell from './FieldShell';

type QuantityStepperProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  min?: number;
  max?: number;
};

export default function QuantityStepper<T extends FieldValues>({
  name,
  control,
  label = 'Quantity',
  min = 1,
  max = 20,
}: QuantityStepperProps<T>) {
  const theme = useTheme();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });
  const quantity = Number(value) || 0;
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)) as PathValue<T, Path<T>>);

  return (
    <View style={styles.row}>
      <FieldShell label={label} error={error?.message} style={styles.field}>
        <TextInput
          value={quantity ? String(quantity) : ''}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, '');
            onChange((digits ? Math.min(max, Number(digits)) : 0) as PathValue<T, Path<T>>);
          }}
          placeholder="Choose Quantity"
          placeholderTextColor={theme.text2}
          keyboardType="number-pad"
          style={[styles.input, { color: theme.text }]}
          accessibilityLabel={label}
        />
      </FieldShell>
      <Pressable
        onPress={() => set(quantity - 1)}
        disabled={quantity <= min}
        style={[styles.button, styles.minus, { borderColor: theme.text2 }, quantity <= min && styles.disabled]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity">
        <Icon name="subtract-line" size={24} color={theme.text} />
      </Pressable>
      <Pressable
        onPress={() => set(quantity + 1)}
        disabled={quantity >= max}
        style={[styles.button, { backgroundColor: theme.primary }, quantity >= max && styles.disabled]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity">
        <Icon name="add-line" size={26} color={Palette.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 20,
  },
  field: {
    flex: 1,
    width: undefined,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  minus: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.4,
  },
});
