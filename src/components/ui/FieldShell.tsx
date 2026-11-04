import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type FieldShellProps = {
  label?: string;
  error?: string;
  focused?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
};

/** Label, bordered box and error message shared by every form field. */
export default function FieldShell({
  label,
  error,
  focused,
  disabled,
  onPress,
  accessibilityLabel,
  children,
  style,
  boxStyle,
}: FieldShellProps) {
  const theme = useTheme();
  const box = [
    styles.box,
    {
      backgroundColor: theme.background,
      borderColor: error ? Palette.error : focused ? theme.primary : theme.borderColor,
    },
    disabled && styles.disabled,
    boxStyle,
  ];

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Typography size={14} weight="500" lineHeight={20}>
          {label}
        </Typography>
      ) : null}
      {onPress ? (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={box}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}>
          {children}
        </Pressable>
      ) : (
        <View style={box}>{children}</View>
      )}
      {error ? (
        <Typography size={12} lineHeight={16} color={Palette.error}>
          {error}
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
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});
