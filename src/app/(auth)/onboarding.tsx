import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import Wrapper from '@/components/utilities/Wrapper';
import { Images } from '@/constants';
import { useTheme } from '@/hooks/use-theme';

const SLIDES = [
  {
    title: 'Request Delivery',
    subtitle: 'Make a request for your parcel to be sent to any state in the country',
    image: Images.onboarding_1,
  },
  {
    title: 'Make Money',
    subtitle: 'Earn while doing Deliveries to the Travel Destination',
    image: Images.onboarding_2,
  },
  {
    title: 'Nationwide Coverage',
    subtitle: 'Send and receive packages anywhere in the country with PosterBox',
    image: Images.onboarding_3,
  },
] as const;

export default function Onboarding() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const pageWidth = Math.max(width - 32, 1);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(nextIndex);
  };

  return (
    <Wrapper>
      <View style={styles.screen}>
        <Image
          source={theme.mode === 'dark' ? Images.logo_white : Images.logo_red}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.dots}>
          {SLIDES.map((slide, index) => (
            <View
              key={slide.title}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? theme.primary : '#D9D9D9' },
              ]}
            />
          ))}
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.title}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: pageWidth }]}>
              <Typography size={18} weight="500" align="center" lineHeight={18}>
                {item.title}
              </Typography>
              <Typography
                size={14}
                weight="400"
                textType="text2"
                align="center"
                lineHeight={17}
                style={styles.subtitle}>
                {item.subtitle}
              </Typography>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>
          )}
        />

        <View style={{ gap: 20, marginBottom: 24, marginTop: 'auto' }}>
          <AppButton title="Sign Up" handlePress={() => router.push('/(auth)/register')} />
          <AppButton
            title="Login"
            variant="secondary"
            handlePress={() => router.push('/(auth)/login')}
          />
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  logo: {
    alignSelf: 'center',
    height: 41,
    width: 133,
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 44,
  },
  dot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  slide: {
    gap: 8,
    paddingTop: 44,
  },
  subtitle: {
    paddingHorizontal: 12,
  },
  image: {
    alignSelf: 'center',
    height: 300,
    marginTop: 40,
    width: '100%',
  },
});