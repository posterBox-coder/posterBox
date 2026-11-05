import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import ActionCard from '@/components/shared/home/ActionCard';
import ComposeFab from '@/components/shared/home/ComposeFab';
import HomeHeader from '@/components/shared/home/HomeHeader';
import PromoBanner from '@/components/shared/home/PromoBanner';
import { ThemedView } from '@/components/themed-view';
import { CURRENT_LOCATION, HOME_ACTIONS } from '@/data/mock';

export default function HomeScreen() {
  const [trackingNo, setTrackingNo] = useState('');

  const handleTrack = () => {
    const code = trackingNo.trim();
    if (!code) {
      router.push('/(home)/track');
      return;
    }
    router.push({
      pathname: '/(home)/track-details',
      params: { trackingNo: code },
    });
  };

  return (
    <ThemedView style={styles.screen}>
      <HomeHeader
        location={CURRENT_LOCATION}
        trackingNo={trackingNo}
        onTrackingNoChange={setTrackingNo}
        onTrack={handleTrack}
        onNotifications={() => router.push('/(home)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PromoBanner />
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            {HOME_ACTIONS.slice(0, 2).map((action) => (
              <ActionCard
                key={action.id}
                title={action.title}
                subtitle={action.subtitle}
                image={action.image}
                width={action.width}
                onPress={() => router.push(action.href)}
              />
            ))}
          </View>
          <View style={styles.gridRow}>
            {HOME_ACTIONS.slice(2).map((action) => (
              <ActionCard
                key={action.id}
                title={action.title}
                subtitle={action.subtitle}
                image={action.image}
                width={action.width}
                onPress={() => router.push(action.href)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <ComposeFab onPress={() => router.push('/(home)/contact-support')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    paddingBottom: 80,
    paddingHorizontal: 16,
    paddingTop: 20,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
