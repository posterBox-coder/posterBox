import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InfoCardProps = {
  title: string;
  subtitle: string;
  meta: string;
  badge?: string;
};

export default function InfoCard({ title, subtitle, meta, badge }: InfoCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <Typography size={15} weight="700" style={styles.title}>
          {title}
        </Typography>
        {badge ? (
          <Typography size={12} weight="600" color={theme.primary}>
            {badge}
          </Typography>
        ) : null}
      </View>
      <Typography size={13} textType="text2">
        {subtitle}
      </Typography>
      <Typography size={12} textType="text2">
        {meta}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 3,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
});
