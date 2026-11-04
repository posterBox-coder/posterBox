import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type SheetHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function SheetHeader({ title, onClose }: SheetHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: theme.divider }]}>
      <Typography size={16} weight="700" align="center" style={styles.title}>
        {title}
      </Typography>
      <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
        <Icon name="close-line" size={24} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    minHeight: 52,
    marginHorizontal: 16,
  },
  title: {
    paddingHorizontal: 40,
  },
  close: {
    position: 'absolute',
    right: 0,
  },
});
