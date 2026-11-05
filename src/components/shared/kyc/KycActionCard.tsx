import { Image, ImageSourcePropType, ImageStyle, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-remix-icon';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type KycActionCardProps = {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  completed?: boolean;
  onPress: () => void;
  imgStyle?: StyleProp<ViewStyle>;
};

export default function KycActionCard({
  image,
  title,
  subtitle,
  completed,
  onPress,
  imgStyle,
}: KycActionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: theme.borderColor, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={styles.row}>
        <Image source={image} style={imgStyle as StyleProp<ImageStyle>} />
        <View style={styles.copy}>
          <Typography size={16} weight="700" lineHeight={22}>
            {title}
          </Typography>
          <Typography size={13} weight="400" textType="text2" lineHeight={18}>
            {subtitle}
          </Typography>
        </View>
        {completed ? <Icon name="checkbox-circle-fill" size={20} color={Palette.success} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.kycCard,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    height: 105,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
