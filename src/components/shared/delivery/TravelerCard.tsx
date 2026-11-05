import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import Avatar from '@/components/ui/Avatar';
import Typography from '@/components/ui/Typography';
import { useTheme } from '@/hooks/use-theme';
import type { TravelerMatch } from '@/types';
import { formatDate, formatLocation } from '@/utils/format';

type TravelerCardProps = {
  match: TravelerMatch;
  selected?: boolean;
  onPress: () => void;
  onInfo: () => void;
};

export default function TravelerCard({ match, selected, onPress, onInfo }: TravelerCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? theme.background : theme.surface,
          borderColor: selected ? theme.primary : theme.borderColor,
        },
      ]}>
      <Avatar name={match.traveler.fullName} uri={match.traveler.avatarUrl} size={40} />
      <View style={styles.copy}>
        <Typography size={15} weight="600" numberOfLines={1}>
          {match.traveler.fullName}
        </Typography>
        <Typography size={12} textType="text2" numberOfLines={1}>
          {formatLocation(match.currentLocation)}
        </Typography>
        <Typography size={11} textType="text3">
          Leaves {formatDate(match.trip.departureDate)} · {match.trip.availableCapacityKg}kg
        </Typography>
      </View>
      <View style={styles.actions}>
        <View style={styles.iconBtn} accessibilityElementsHidden>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.text3} style={{fontWeight: 700}} />
        </View>
        <Pressable onPress={onInfo} hitSlop={8} style={styles.iconBtn} accessibilityLabel={`About ${match.traveler.fullName}`}>
          <AntDesign name="info-circle" size={20} color={theme.text3} />        
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  iconBtn: {
    padding: 6,
  },
});
