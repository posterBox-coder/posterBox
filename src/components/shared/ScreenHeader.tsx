import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import CurvedHeader from '@/components/shared/CurvedHeader';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export default function ScreenHeader({ title, showBack = true, onBack }: ScreenHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <CurvedHeader>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={handleBack} hitSlop={12} style={styles.side} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="arrow-left-s-line" size={28} color={Palette.white} />
          </Pressable>
        ) : (
          <View style={styles.side} />
        )}
        <Typography size={16} weight="600" color={Palette.white} align="center" style={styles.title}>
          {title}
        </Typography>
        <View style={styles.side} />
      </View>
    </CurvedHeader>
  );
}

const styles = StyleSheet.create({

  row: {
    alignItems: 'center',
    flexDirection: 'row',
    // minHeight: 44,
    paddingTop: 20,
  },
  side: {
    width: 40,
  },
  title: {
    flex: 1,
  },
});
