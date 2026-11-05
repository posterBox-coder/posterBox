import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

const LOGO = require('../../../assets/images/logo.png');
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = (378 / 362) * LOGO_WIDTH;

type AnimatedSplashProps = {
  isAppReady: boolean;
  restoreColor: string;
  onAnimationComplete: () => void;
};

const MIN_VISIBLE_MS = 1600;

export default function AnimatedSplash({
  isAppReady,
  restoreColor,
  onAnimationComplete,
}: AnimatedSplashProps) {
  const scale = useSharedValue(0.7);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const restoreColorRef = useRef(restoreColor);
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    restoreColorRef.current = restoreColor;
  }, [restoreColor]);

  useLayoutEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.light.primary).catch(() => {});
    return () => {
      SystemUI.setBackgroundColorAsync(restoreColorRef.current).catch(() => {});
    };
  }, []);

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

    const finishSplash = () => {
      onAnimationCompleteRef.current();
    };

    const timeout = setTimeout(finishSplash, MIN_VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [isAppReady]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLayout = () => {
    if (nativeSplashHidden.current) {
      return;
    }
    nativeSplashHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  };

  return (
    <Animated.View pointerEvents="none" onLayout={handleLayout} style={[StyleSheet.absoluteFill, styles.root]}>
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
