import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { STATUS_META } from '@/constants/delivery';
import { StatusTones } from '@/constants/theme';
import type { DeliveryStatus } from '@/types';

export default function StatusChip({ status }: { status: DeliveryStatus }) {
  const { label, tone } = STATUS_META[status];
  const colors = StatusTones[tone];

  return (
    <View style={[styles.chip, { backgroundColor: colors.background }]}>
      <Typography size={11} weight="700" color={colors.text} style={styles.label}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
