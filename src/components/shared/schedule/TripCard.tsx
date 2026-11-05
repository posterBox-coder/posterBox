import { Pressable, StyleSheet, View } from 'react-native';

import { RadioDot } from '@/components/ui/RadioGroup';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Trip } from '@/types';
import { formatDayBadge, formatLocation } from '@/utils/format';

type TripCardProps = {
  trip: Trip;
  selecting?: boolean;
  selected?: boolean;
  onPress: () => void;
};

export default function TripCard({ trip, selecting, selected, onPress }: TripCardProps) {
  const theme = useTheme();
  const badge = formatDayBadge(trip.departureDate);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.background, borderColor: selected ? theme.primary : theme.borderColor, borderWidth: selected ? 1 : 0 }]}>
      <View style={[styles.badge, { backgroundColor: theme.primary }]}>
        <Typography size={18} weight="700" color={Palette.white} align="center">
          {badge.day}
        </Typography>
        <Typography size={11} weight="600" color={Palette.white} align="center">
          {badge.month}
        </Typography>
      </View>
      <View style={styles.copy}>
        <Typography size={15} weight="700">
          {formatLocation(trip.from)}
        </Typography>
        <Typography size={13} textType="text2">
          to {formatLocation(trip.to)}
        </Typography>
        <Typography size={12} textType="text3">
          {trip.availableCapacityKg}kg available
        </Typography>
      </View>
      {selecting ? <RadioDot selected={!!selected} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
