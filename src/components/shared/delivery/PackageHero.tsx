import images from '@/constants/images';
import { type ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import CodeCard from '@/components/shared/CodeCard';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';

type PackageHeroProps = {
  title: string;
  message: string;
  code?: string;
  shareMessage?: string;
  children?: ReactNode;
};

export default function PackageHero({ title, message, code, shareMessage, children }: PackageHeroProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Image source={images.packageCheck} style={{ width: 80, height: 80 }} />
        <View style={styles.check}>
          <Icon name="check-line" size={16} color={Palette.successGreen} />
        </View>
      </View>
      <Typography size={18} weight="700" align="center">
        {title}
      </Typography>
      <Typography size={14} textType="text2" align="center" style={styles.message}>
        {message}
      </Typography>
      {code ? <CodeCard code={code} shareMessage={shareMessage} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 24,
  },
  icon: {
    alignItems: 'center',
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  check: {
    position: 'absolute',
    right: 8,
    top: 12,
  },
  message: {
    maxWidth: 280,
  },
});
