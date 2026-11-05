import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable, StyleSheet, View } from 'react-native';

import CurvedHeader from '@/components/shared/CurvedHeader';
import LocationChip from '@/components/shared/home/LocationChip';
import TrackingSearch from '@/components/shared/home/TrackingSearch';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';

type HomeHeaderProps = {
  location: string;
  trackingNo: string;
  onTrackingNoChange: (value: string) => void;
  onTrack: () => void;
  onNotifications: () => void;
};

export default function HomeHeader({
  location,
  trackingNo,
  onTrackingNoChange,
  onTrack,
  onNotifications,
}: HomeHeaderProps) {
  return (
    <CurvedHeader style={styles.header}>
      <View style={styles.topRow}>
        <LocationChip label={location} />
        <Pressable
          onPress={onNotifications}
          style={styles.bell}
          accessibilityRole="button"
          accessibilityLabel="Notifications">
          <FontAwesome6 name="bell" size={18} color={Palette.white} />
        </Pressable>
      </View>

      <Typography size={18} weight="600" color={Palette.white} style={styles.title}>
        Track Your Package
      </Typography>
      <Typography size={12} weight="400" color="#FFFFFFBF" style={styles.subtitle}>
        Enter Tracking Number
      </Typography>

      <TrackingSearch value={trackingNo} onChange={onTrackingNoChange} onSubmit={onTrack} />
    </CurvedHeader>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  bell: {
    backgroundColor: Palette.headerChip,
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    width: 36,
    justifyContent: 'center',
  },
  title: {
    marginTop: 22,
  },
  subtitle: {
    marginTop: 10,
    marginLeft: 10,
  },
});
