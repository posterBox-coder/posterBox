import type { IconName } from 'react-native-remix-icon';

export const SUPPORT = {
  phone: '07002255438',
  phoneUrl: 'tel:07002255438',
  email: 'contact@posterbox.com.ng',
  emailUrl: 'mailto:contact@posterbox.com.ng',
  whatsappUrl: 'https://wa.me/2347002255438',
} as const;

export const SUPPORT_LINKS: { id: string; label: string; icon: IconName; url: string; tint?: string }[] = [
  { id: 'twitter', label: 'Twitter', icon: 'twitter-x-line', url: 'https://twitter.com/posterboxng' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook-fill', url: 'https://facebook.com/posterboxng' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram-line', url: 'https://instagram.com/posterboxng' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin-fill', url: 'https://www.linkedin.com/company/posterbox' },
];
