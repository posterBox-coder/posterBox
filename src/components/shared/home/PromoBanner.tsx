import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function PromoBanner() {
  const theme = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.homeCard }]}>
      <Typography size={18} weight="500" align="center" color={theme.text3} font={Fonts.italic} style={styles.text}>
        Earn While doing Deliveries for People
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  text: {
    fontStyle: 'italic',
  },
});
