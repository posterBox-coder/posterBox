import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

const LOGO = require('../../../assets/images/logo.png');
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = (378 / 362) * LOGO_WIDTH;

type AnimatedSplashProps = {
  isAppReady: boolean;
  onAnimationComplete: () => void;
};

const MIN_VISIBLE_MS = 1600;

export default function AnimatedSplash({ isAppReady, onAnimationComplete }: AnimatedSplashProps) {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) }),
      withTiming(0.88, { duration: 480, easing: Easing.inOut(Easing.quad) }),
      withTiming(1, { duration: 480, easing: Easing.inOut(Easing.quad) })
    );
  }, [scale]);

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    opacity.value = withDelay(
      MIN_VISIBLE_MS,
      withTiming(0, { duration: 420, easing: Easing.out(Easing.quad) }, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
  }, [isAppReady, onAnimationComplete, opacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.root, overlayStyle]}>
      <Animated.Image source={LOGO} style={[styles.logo, logoStyle]} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    zIndex: 100,
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
  },
});
