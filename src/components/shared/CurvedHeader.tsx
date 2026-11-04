import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type CurvedHeaderProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function CurvedHeader({ children, style }: CurvedHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // console.log('insets', insets);
  // console.log('insets.top', insets.top);

  return (
    <View style={[styles.header, { backgroundColor: theme.primary, paddingTop: insets.top + 16 }, style]}>
      <StatusBar style="light" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});
