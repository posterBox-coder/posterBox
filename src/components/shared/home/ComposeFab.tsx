import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ComposeFabProps = {
  onPress: () => void;
};

export default function ComposeFab({ onPress }: ComposeFabProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.fab, { backgroundColor: theme.primary }]}
      accessibilityRole="button"
      accessibilityLabel="Contact support">
      <Icon name="send-plane-fill" size={20} color={Palette.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    borderRadius: 19,
    bottom: 16,
    elevation: 6,
    height: 38,
    width: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: 25,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
