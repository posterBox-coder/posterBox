import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type AppButtonProps = {
  title: string;
  handlePress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

export default function AppButton({
  title,
  handlePress,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  style,
}: AppButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isTertiary = variant === 'tertiary';
  const isInactive = disabled || isLoading;
  const textColor = isPrimary ? Palette.white : isTertiary ? theme.text2 : theme.primary;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        { borderColor: theme.primary, backgroundColor: isPrimary ? theme.primary : Palette.white },
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Typography weight="600" size={16} color={textColor} align="center">
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    padding: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    borderWidth: 0,
  },
  secondary: {
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
