import { Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Typography from './Typography';

type SegmentedControlProps<V extends string> = {
  options: readonly { value: V; label: string }[];
  value: V;
  onChange: (value: V) => void;
};

export default function SegmentedControl<V extends string>({ options, value, onChange }: SegmentedControlProps<V>) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.surface }]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && { backgroundColor: theme.primary }]}>
            <Typography size={14} weight="600" color={selected ? Palette.white : theme.text2}>
              {option.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 24,
    flexDirection: 'row',
    padding: 4,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 20,
    flex: 1,
    paddingVertical: 10,
  },
});
