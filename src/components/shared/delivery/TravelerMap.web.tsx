import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import type { TravelerMatch } from '@/types';

type TravelerMapProps = {
  matches: TravelerMatch[];
  selectedId?: string;
  onSelect: (travelerId: string) => void;
};

export default function TravelerMap(_props: TravelerMapProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.fallback]}>
      <Typography size={13} textType="text2" align="center">
        Map preview is available on iOS and Android.
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: '#E8EEF2',
    justifyContent: 'center',
    padding: 24,
  },
});
