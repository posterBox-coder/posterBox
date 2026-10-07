import { useState } from 'react';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import {
	StyleSheet,
	TextInput,
	type TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-remix-icon';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  rules?: object;
  isPassword?: boolean;
  label?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'secureTextEntry'>;

export default function Input<T extends FieldValues>({
  name,
  control,
  placeholder = '',
  rules,
  isPassword = false,
  label,
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
    keyboardType ??
    (name === 'email' ? 'email-address' : name === 'phone' ? 'phone-pad' : 'default');

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Typography size={14} weight="500" lineHeight={20}>
          {label}
        </Typography>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.background,
            borderColor: error ? Palette.error : isFocused ? theme.primary : theme.borderColor,
          },
        ]}>
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
            <Icon
              name={isPasswordVisible ? 'eye-line' : 'eye-off-line'}
              size={20}
              color={theme.text2}
            />
          </TouchableOpacity>
        ) : null}
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
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
	fontWeight: '600'
  },
});
