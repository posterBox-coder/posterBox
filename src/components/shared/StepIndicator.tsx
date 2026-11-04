import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StepIndicatorProps = {
  current: number;
  total?: number;
};

export default function StepIndicator({ current, total = 3 }: StepIndicatorProps) {
  const theme = useTheme();

  return (
    <View style={styles.row} accessibilityLabel={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const isCurrent = step === current;
        return (
          <View key={step} style={styles.item}>
            {index > 0 ? <View style={[styles.line, { backgroundColor: theme.text2 }]} /> : null}
            {isCurrent ? (
              <View style={[styles.current, { backgroundColor: theme.primary }]}>
                <Typography size={13} weight="600" color={Palette.white}>
                  {step}
                </Typography>
              </View>
            ) : (
              <View
                style={[
                  styles.dot,
                  { borderColor: theme.text2 },
                  step < current && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  line: {
    height: 1,
    width: 26,
  },
  current: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  dot: {
    borderRadius: 7,
    borderWidth: 1,
    height: 14,
    width: 14,
  },
});
