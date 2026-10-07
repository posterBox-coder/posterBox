import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Typography from '@/components/ui/Typography';
import { useTheme } from '@/hooks/use-theme';

type AuthHeaderProps = {
  title?: string;
  subtitle: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function AuthHeader({ title, subtitle, actionLabel, onActionPress, style }: AuthHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.header, !title && styles.headerCompact, style]}>
      {title ? (
        <Typography size={24} weight="700" align="center" lineHeight={30}>
          {title}
        </Typography>
      ) : null}
      <Pressable disabled={!onActionPress} onPress={onActionPress}>
        <Typography size={16} weight="400" textType="text2" align="center" lineHeight={20}>
          {subtitle}
          {actionLabel ? ' ' : ''}
          {actionLabel ? (
            <Typography size={14} weight="500" color={theme.primary}>
              {actionLabel}
            </Typography>
          ) : null}
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  headerCompact: {
    marginBottom: 20,
    marginTop: 8,
  },
});
