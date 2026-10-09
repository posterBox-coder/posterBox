import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    text2: '#2A2A2A',
    background: '#FFFFFF',
    primary: '#AA0000',
    borderColor: '#0000003D',
    // icon: '#687076',
    // button: '#E9F1FF',
    // inputBackground: '#CBCDCD33',
    // card: '#EFFAF6',
    // card2: '#DEEBED',
    // tabBorderColor: '#E2E8F0',
    // skeletonLoader1: '#D1D5DB',
    // skeletonLoader2: '#E9F1FF',
  },
  dark: {
    text: '#FFFFFF',
    text2: '#C6C8C8',
    background: '#000000',
    primary: '#AA0000',
    borderColor: '#0000003D',
    // icon: '#687076',
    // button: '#E9F1FF',
    // inputBackground: '#CBCDCD33',
    // card: '#EFFAF6',
    // card2: '#DEEBED',
    // tabBorderColor: '#E2E8F0',
    // skeletonLoader1: '#D1D5DB',
    // skeletonLoader2: '#E9F1FF',
  },
} as const;

export const Palette = {
  error: '#991313',
  success: '#24FD11',
  white: '#FFFFFF',
  amber: '#A58404',
  transparentBlack: 'rgba(0, 0, 0, 0.8)',
  kycCard: '#F8F0E8',
  kycNote: '#F6E89A',
  kycPending: '#F5A623',
  avatarMuted: '#D0D0D0',
  avatarBg: '#F2F2F2',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  thin: 'Inter-Thin',
  extraLight: 'Inter-ExtraLight',
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
  italic: 'Inter-Italic',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
