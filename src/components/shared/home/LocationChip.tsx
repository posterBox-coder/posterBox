import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';

type LocationChipProps = {
  label: string;
};

export default function LocationChip({ label }: LocationChipProps) {
  return (
    <View style={styles.chip} accessible accessibilityLabel={`Current location ${label}`}>
      <Icon name="map-pin-line" size={19} color={Palette.white} />
      <Typography size={12} weight="400" color={Palette.white} numberOfLines={1} style={styles.label}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: Palette.headerChip,
    borderRadius: 15,
    flexDirection: 'row',
    gap: 6,
    maxWidth: '78%',
    minWidth: 166,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    textTransform: 'lowercase',
  },
});
