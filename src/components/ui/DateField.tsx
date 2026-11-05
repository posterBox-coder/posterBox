import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';

import { useTheme } from '@/hooks/use-theme';
import { formatDate, parseDate, toISODate } from '@/utils/format';

import AppButton from './AppButton';
import BottomSheetModal from './BottomSheetModal';
import FieldShell from './FieldShell';
import Typography from './Typography';

type DateFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

/** Stores the picked day as an ISO date string (YYYY-MM-DD). */
export default function DateField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'DD/MM/YYYY',
  minimumDate,
  maximumDate,
}: DateFieldProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });
  const current = value ? parseDate(value) : (minimumDate ?? new Date());
  const [draft, setDraft] = useState(current);

  const openPicker = () => {
    setDraft(current);
    setOpen(true);
  };

  const commit = (date: Date) => {
    onChange(toISODate(date));
    setOpen(false);
  };

  return (
    <>
      <FieldShell label={label} error={error?.message} onPress={openPicker} accessibilityLabel={label ?? 'Pick a date'}>
        <Typography size={15} color={value ? theme.text : theme.text2} style={styles.value}>
          {value ? formatDate(value) : placeholder}
        </Typography>
        <Icon name="arrow-down-s-line" size={20} color={theme.text2} />
      </FieldShell>

      {Platform.OS === 'ios' ? (
        <BottomSheetModal visible={open} onClose={() => setOpen(false)} title={label ?? 'Select date'}>
          <DateTimePicker
            value={draft}
            display="inline"
            accentColor={theme.primary}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={(_, date) => setDraft(date)}
          />
          <AppButton title="Done" handlePress={() => commit(draft)} style={styles.done} />
        </BottomSheetModal>
      ) : open ? (
        <DateTimePicker
          value={draft}
          presentation="dialog"
          accentColor={theme.primary}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={(_, date) => commit(date)}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  value: {
    flex: 1,
  },
  done: {
    marginTop: 12,
  },
});
