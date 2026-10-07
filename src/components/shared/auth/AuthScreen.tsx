import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import KeyboardWrapper from '@/components/utilities/KeyboardWrapper';

type AuthScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
};

export default function AuthScreen({ children, footer, style }: AuthScreenProps) {
  return (
    <KeyboardWrapper>
      <View style={[styles.screen, style]}>
        <View style={styles.body}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 12,
  },
  body: {
    flexGrow: 1,
  },
  footer: {
    marginBottom: 8,
    marginTop: 'auto',
    paddingTop: 24,
  },
});
