import { Text, type TextProps, StyleSheet } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'small' | 'smallBold' | 'link';
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const colorFromProps = scheme === 'dark' ? darkColor : lightColor;
  const color = colorFromProps ?? theme[themeColor ?? 'text'];

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'subtitle' && styles.subtitle,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'link' && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  small: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 30,
  },
});
