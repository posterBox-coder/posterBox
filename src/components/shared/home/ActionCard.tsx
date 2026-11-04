import { Image, type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { useTheme } from '@/hooks/use-theme';

type ActionCardProps = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  width?: number;
  onPress: () => void;
};

export default function ActionCard({ title, subtitle, image, width, onPress }: ActionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.homeCard, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={styles.iconWrap}>
        <Image source={image} style={ { width, height: 24, resizeMode: 'contain' }}  />
      </View>
      <Typography size={14} weight="700"  lineHeight={20}>
        {title}
      </Typography>
      <Typography size={12} weight="400" textType="text2" lineHeight={16}>
        {subtitle}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    flex: 1,
    gap: 8,
    minHeight: 184,
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'flex-start',
    
  },
  iconWrap: {
    marginBottom: 4,
  },
 
});
