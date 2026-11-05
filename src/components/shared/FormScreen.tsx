import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';

type FormScreenProps = {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function FormScreen({
  title,
  onBack,
  showBack = true,
  children,
  footer,
  contentStyle,
}: FormScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title={title} showBack={showBack} onBack={onBack} />
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, contentStyle]}>
        {children}
      </KeyboardAwareScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>{footer}</View> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  footer: {
    gap: 12,
    paddingHorizontal: 16,
  },
});
