import { type ReactNode, useState } from 'react';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';

import { useTheme } from '@/hooks/use-theme';

import BottomSheetModal from './BottomSheetModal';
import FieldShell from './FieldShell';
import Typography from './Typography';

export type SelectOption = string | { label: string; value: string };

const optionValue = (option: SelectOption) => (typeof option === 'string' ? option : option.value);
const optionLabel = (option: SelectOption) => (typeof option === 'string' ? option : option.label);

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly SelectOption[];
  rules?: object;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onSelect?: (value: string) => void;
  accessory?: ReactNode;
};

export default function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  rules,
  placeholder = 'Select',
  disabled,
  isLoading,
  onSelect,
  accessory,
}: SelectFieldProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, rules });

  const selected = options.find((option) => optionValue(option) === value);

  return (
    <>
      <FieldShell
        label={label}
        error={error?.message}
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityLabel={`${label}${selected ? `, ${optionLabel(selected)}` : ''}`}>
        <Typography
          size={16}
          weight={selected ? '600' : '400'}
          color={selected ? theme.text : theme.text2}
          numberOfLines={1}
          style={styles.value}>
          {selected ? optionLabel(selected) : placeholder}
        </Typography>
        {accessory}
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.text2} />
        ) : (
          <Icon name="arrow-down-s-line" size={22} color={theme.text2} />
        )}
      </FieldShell>

      <BottomSheetModal visible={open} onClose={() => setOpen(false)} title={label} contentStyle={styles.sheet}>
        <FlatList
          data={options}
          keyExtractor={optionValue}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isSelected = optionValue(item) === value;
            return (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onChange(optionValue(item));
                  onSelect?.(optionValue(item));
                  setOpen(false);
                }}>
                <Typography size={16} weight={isSelected ? '600' : '400'}>
                  {optionLabel(item)}
                </Typography>
                {isSelected ? <Icon name="check-line" size={18} color={theme.primary} /> : null}
              </Pressable>
            );
          }}
        />
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  value: {
    flex: 1,
  },
  sheet: {
    paddingTop: 4,
    paddingBottom: 20,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
});
