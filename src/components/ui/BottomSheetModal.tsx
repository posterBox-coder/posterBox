import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import SheetHeader from './SheetHeader';

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function BottomSheetModal({ visible, onClose, title, children, contentStyle }: BottomSheetModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss" />
        <View style={[styles.sheet, { backgroundColor: theme.background, paddingBottom: Math.max(insets.bottom, 16) }]}>
          {title ? <SheetHeader title={title} onClose={onClose} /> : null}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Palette.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    paddingTop: 8,
  },
  content: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 46,
  },
});
