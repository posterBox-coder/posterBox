import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import Typography from '@/components/ui/Typography';
import { useTheme } from '@/hooks/use-theme';

type DetailsCardProps = {
  children: ReactNode;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function DetailsCard({ children, bordered = false, style }: DetailsCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface },
        bordered && { borderColor: theme.text, borderWidth: StyleSheet.hairlineWidth * 2 },
        style,
      ]}>
      {children}
    </View>
  );
}

type DetailRowProps = {
  label: string;
  value: ReactNode;
  caption?: string;
  emphasis?: boolean;
};

export function DetailRow({ label, value, caption, emphasis = false }: DetailRowProps) {
  return (
    <View style={styles.row}>
      <Typography size={13} textType="text2" style={styles.label}>
        {label}
      </Typography>
      <View style={styles.valueCol}>
        {typeof value === 'string' ? (
          <Typography size={emphasis ? 20 : 15} weight={emphasis ? '700' : '400'} align="right">
            {value}
          </Typography>
        ) : (
          value
        )}
        {caption ? (
          <Typography size={11} textType="text3" align="right">
            {caption}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}

export function DetailDivider() {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    gap: 18,
    padding: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  label: {
    minWidth: 56,
  },
  valueCol: {
    alignItems: 'flex-end',
    flex: 1,
    gap: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
