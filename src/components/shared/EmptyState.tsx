import { StyleSheet, View } from 'react-native';
import Icon, { type IconName } from 'react-native-remix-icon';

import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon = 'inbox-2-line',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Icon name={icon} size={40} color={theme.muted} />
      <Typography size={16} weight="600" align="center">
        {title}
      </Typography>
      <Typography size={14} textType="text2" align="center" style={styles.message}>
        {message}
      </Typography>
      {actionLabel && onAction ? <AppButton title={actionLabel} handlePress={onAction} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  message: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    maxWidth: 220,
  },
});
