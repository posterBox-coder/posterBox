import { useState, type ReactNode } from 'react';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { StyleSheet, TextInput, type TextInputProps, TouchableOpacity } from 'react-native';
import Icon from 'react-native-remix-icon';

import { useTheme } from '@/hooks/use-theme';

import FieldShell from './FieldShell';

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  rules?: object;
  isPassword?: boolean;
  label?: string;
  right?: ReactNode;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'secureTextEntry'>;

export default function Input<T extends FieldValues>({
  name,
  control,
  placeholder = '',
  rules,
  isPassword = false,
  label,
  right,
  style,
  keyboardType,
  autoComplete,
  autoCapitalize,
  ...props
}: InputProps<T>) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const resolvedKeyboardType =
    keyboardType ?? (name === 'email' ? 'email-address' : name === 'phone' ? 'phone-pad' : 'default');

  return (
    <FieldShell label={label} error={error?.message} focused={isFocused}>
      <TextInput
        {...props}
        style={[styles.input, { color: theme.text }, style]}
        placeholder={placeholder}
        placeholderTextColor={theme.text2}
        value={value}
        onChangeText={onChange}
        onBlur={() => {
          onBlur();
          setIsFocused(false);
        }}
        onFocus={() => setIsFocused(true)}
        keyboardType={resolvedKeyboardType}
        autoComplete={autoComplete ?? (name === 'email' ? 'email' : 'off')}
        autoCapitalize={autoCapitalize ?? (name === 'email' ? 'none' : 'sentences')}
        secureTextEntry={isPassword && !isPasswordVisible}
        cursorColor={theme.primary}
        selectionColor={theme.primary}
      />

      {isPassword ? (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible((visible) => !visible)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}>
          <Icon name={isPasswordVisible ? 'eye-line' : 'eye-off-line'} size={20} color={theme.text2} />
        </TouchableOpacity>
      ) : null}
      {right}
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
    paddingVertical: 0,
  },
});
