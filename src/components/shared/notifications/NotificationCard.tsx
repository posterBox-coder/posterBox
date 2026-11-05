import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import Typography from '@/components/ui/Typography';
import { NOTIFICATION_ICON } from '@/constants/delivery';
import { Palette } from '@/constants/theme';
import type { AppNotification } from '@/types';
import { formatDate } from '@/utils/format';
import { useTheme } from '@/hooks/use-theme';

type NotificationCardProps = {
  item: AppNotification;
  meta?: string;
  onAccept?: (item: AppNotification) => void;
  onDecline?: (item: AppNotification) => void;
  onView?: (item: AppNotification) => void;
};

export default function NotificationCard({ item, meta, onAccept, onDecline, onView }: NotificationCardProps) {
  const theme = useTheme();
  const isRequest = item.type === 'DELIVERY_REQUEST';
  const lines = item.body.split('\n').filter(Boolean);

  return (
    <Pressable
      onPress={() => onView?.(item)}
      style={[styles.card, { backgroundColor: theme.background, opacity: item.read && !isRequest ? 0.72 : 1 }]}>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <Icon name={NOTIFICATION_ICON[item.type]} size={16} color={theme.primary} />
          <Typography size={14} weight="700" style={styles.title} numberOfLines={1}>
            {item.title}
          </Typography>
        </View>
        <Typography size={12} textType="text2">
          {meta ?? formatDate(item.createdAt)}
        </Typography>
      </View>

      <View style={styles.bottom}>
        <View style={styles.copy}>
          {lines.map((line) => (
            <Typography key={line} size={13} textType="text2">
              {line}
            </Typography>
          ))}
        </View>

        {isRequest ? (
          <View style={styles.actions}>
            <Pressable
              onPress={() => onDecline?.(item)}
              style={[styles.circle, { borderColor: theme.primary }]}
              accessibilityLabel="Decline request">
              <Icon name="close-line" size={16} color={theme.primary} />
            </Pressable>
            <Pressable
              onPress={() => onAccept?.(item)}
              style={[styles.circle, { borderColor: theme.primary }]}
              accessibilityLabel="Accept request">
              <Icon name="check-line" size={16} color={theme.primary} />
            </Pressable>
          </View>
        ) : (
          <Typography size={14} weight="600" color={theme.primary}>
            view
          </Typography>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 3,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  top: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  bottom: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  circle: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
});
