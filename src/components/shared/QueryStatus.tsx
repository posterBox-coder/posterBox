import { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { errorMessage } from '@/api/client';
import { useTheme } from '@/hooks/use-theme';

type QueryStatusProps = {
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;
  children: ReactNode;
};

export default function QueryStatus({ isLoading, error, onRetry, children }: QueryStatusProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Typography align="center" textType="text2">
          {errorMessage(error)}
        </Typography>
        {onRetry ? <AppButton title="Try again" handlePress={onRetry} style={styles.retry} /> : null}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  retry: {
    maxWidth: 180,
  },
});
