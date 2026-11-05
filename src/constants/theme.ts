import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    text2: '#2A2A2A',
    text3: '#626262',
    background: '#FFFFFF',
    primary: '#AA0000',
    borderColor: '#0000003D',
    homeCard: '#F9E2E2',
    surface: '#F9F0F0',
    divider: '#0000001F',
    muted: '#6B6B6B',
    tabInactive: '#8A8A8A',
  },
  dark: {
    text: '#FFFFFF',
    text2: '#C6C8C8',
    text3: '#B3B3B3',
    background: '#000000',
    primary: '#AA0000',
    borderColor: '#0000003D',
    homeCard: '#3A1A1A',
    surface: '#1E1616',
    divider: '#FFFFFF1F',
    muted: '#A3A3A3',
    tabInactive: '#9A9A9A',
  },
} as const;

export const Palette = {
  error: '#991313',
  success: '#24FD11',
  white: '#FFFFFF',
  amber: '#A58404',
  transparentBlack: 'rgba(0, 0, 0, 0.8)',
  kycCard: '#F9F0F0',
  kycNote: '#F6E89A',
  kycPending: '#FFA500',
  avatarMuted: '#D9D9D93D',
  avatarBg: '#D9D9D93D',
  searchYellow: '#E59707',
  headerChip: '#FFFFFF24',
  timeline: '#8ECBE8',
  cardShadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.35)',
  successGreen: '#2DB928',
  phoneGreen: '#24C80E',
  link: '#1D3A6B',
  avatar: '#D9D9D9',
} as const;

export type StatusTone = 'amber' | 'blue' | 'green' | 'red' | 'grey';

export const StatusTones: Record<StatusTone, { background: string; text: string }> = {
  amber: { background: '#FFF3D1', text: '#8A6A00' },
  blue: { background: '#E1F0FB', text: '#1B5F95' },
  green: { background: '#E2F6E4', text: '#1D7A2B' },
  red: { background: '#FBE3E3', text: '#AA0000' },
  grey: { background: '#ECECEC', text: '#5A5A5A' },
};

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
