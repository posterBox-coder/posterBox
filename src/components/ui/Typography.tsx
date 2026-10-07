import { type ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type TypographyProps = Omit<TextProps, 'style'> & {
  children: ReactNode;
  weight?: FontWeight;
  textType?: ThemeColor;
  font?: string;
  size?: number;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  lineHeight?: number;
  color?: string;
};

const FONT_BY_WEIGHT: Record<FontWeight, string> = {
  '100': Fonts.thin,
  '200': Fonts.extraLight,
  '300': Fonts.light,
  '400': Fonts.regular,
  '500': Fonts.medium,
  '600': Fonts.semiBold,
  '700': Fonts.bold,
  '800': Fonts.extraBold,
  '900': Fonts.black,
};

export default function Typography({
  children,
  textType = 'text',
  weight = '400',
  font,
  size = 16,
  align,
  style,
  lineHeight,
  color,
  ...rest
}: TypographyProps) {
  const theme = useTheme();

  return (
    <Text
      {...rest}
      style={[
        {
          color: color ?? theme[textType],
          fontFamily: font ?? FONT_BY_WEIGHT[weight],
          fontSize: size,
          textAlign: align,
          lineHeight: lineHeight ?? size,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}
