import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { initials } from '@/utils/format';

import Typography from './Typography';

type AvatarProps = {
  name: string;
  uri?: string;
  size?: number;
};

export default function Avatar({ name, uri, size = 36 }: AvatarProps) {
  const dimensions = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={dimensions} contentFit="cover" accessibilityLabel={name} />;
  }

  return (
    <View style={[styles.fallback, dimensions]} accessibilityLabel={name}>
      <Typography size={size * 0.38} weight="600" color="#555555">
        {initials(name)}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: Palette.avatar,
    justifyContent: 'center',
  },
});
