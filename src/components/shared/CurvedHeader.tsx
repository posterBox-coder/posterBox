import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { Platform, StatusBar as NativeStatusBar, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type CurvedHeaderProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function CurvedHeader({ children, style }: CurvedHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();


  return (
    <View style={[styles.header, { backgroundColor: theme.primary, paddingTop: insets.top + 16 }, style]}>
      <StatusBar style="light" />
      {Platform.OS === 'android' ? (
        <NativeStatusBar translucent backgroundColor={theme.primary} barStyle="light-content" />
      ) : null}
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
