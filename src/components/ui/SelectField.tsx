import { useState } from 'react';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-remix-icon';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly string[];
  rules?: object;
  placeholder?: string;
};

export default function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  rules,
  placeholder = 'Select',
}: SelectFieldProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <View style={styles.wrapper}>
      <Typography size={14} weight="500" lineHeight={20}>
        {label}
      </Typography>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          {
            backgroundColor: theme.background,
            borderColor: error ? Palette.error : theme.borderColor,
          },
        ]}>
        <Typography
          size={16}
          weight="600"
          color={value ? theme.text : theme.text2}
          numberOfLines={1}
          style={styles.value}>
          {value || placeholder}
        </Typography>
        <Icon name="arrow-down-s-line" size={22} color={theme.text2} />
      </Pressable>
      {error?.message ? (
        <Typography size={12} lineHeight={16} color={Palette.error}>
          {error.message}
        </Typography>
      ) : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <SafeAreaView edges={['bottom']} style={[styles.sheet, { backgroundColor: theme.background }]}>
            <View style={styles.sheetHeader}>
              <Typography size={16} weight="600">
                {label}
              </Typography>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Icon name="close-line" size={24} color={theme.text} />
              </Pressable>
            </View>
            <FlatList
              data={[...options]}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}>
                  <Typography size={16} weight={item === value ? '600' : '400'}>
                    {item}
                  </Typography>
                  {item === value ? <Icon name="check-line" size={18} color={theme.primary} /> : null}
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    width: '100%',
  },
  field: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 12,
  },
  value: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
});
