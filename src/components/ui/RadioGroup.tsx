import { type Control, type FieldValues, type Path, type PathValue, useController } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type RadioOption<V> = { value: V; label: string };

type RadioGroupProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: readonly RadioOption<PathValue<T, Path<T>>>[];
  label?: string;
  variant?: 'inline' | 'list';
};

export function RadioDot({ selected }: { selected: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.outer, { borderColor: selected ? theme.primary : theme.text2 }]}>
      {selected ? <View style={[styles.inner, { backgroundColor: theme.primary }]} /> : null}
    </View>
  );
}

export default function RadioGroup<T extends FieldValues>({
  name,
  control,
  options,
  label,
  variant = 'inline',
}: RadioGroupProps<T>) {
  const theme = useTheme();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });
  const isList = variant === 'list';

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Typography size={14} weight="500" lineHeight={20}>
          {label}
        </Typography>
      ) : null}
      <View
        accessibilityRole="radiogroup"
        style={[
          isList ? styles.list : styles.inline,
          isList && { borderColor: error ? Palette.error : theme.borderColor },
        ]}>
        {options.map((option, index) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={String(option.value)}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[
                styles.option,
                isList && styles.listOption,
                isList && index > 0 && { borderTopColor: theme.divider, borderTopWidth: StyleSheet.hairlineWidth },
              ]}>
              <RadioDot selected={selected} />
              <Typography size={14} weight={selected ? '600' : '400'}>
                {option.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
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
  },
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 28,
  },
  list: {
    borderRadius: 8,
    borderWidth: 1,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
  },
  listOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  outer: {
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  inner: {
    borderRadius: 4.5,
    height: 9,
    width: 9,
  },
});
