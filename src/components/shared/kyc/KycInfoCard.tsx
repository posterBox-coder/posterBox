import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type KycInfoCardProps = {
  lines: string[];
  variant?: 'default' | 'note';
};

export default function KycInfoCard({ lines, variant = 'default' }: KycInfoCardProps) {
  const theme = useTheme();
  const isNote = variant === 'note';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isNote ? Palette.kycNote : Palette.kycCard,
          borderColor: theme.borderColor,
        },
      ]}>
      {lines.map((line) => (
        <Typography key={line} size={14} weight="500" lineHeight={20}>
          {line}
        </Typography>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
