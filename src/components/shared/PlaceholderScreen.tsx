import { StyleSheet, View } from 'react-native';
import { type IconName } from 'react-native-remix-icon';

import EmptyState from '@/components/shared/EmptyState';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';

type PlaceholderScreenProps = {
  title: string;
  message: string;
  icon?: IconName;
  showBack?: boolean;
};

export default function PlaceholderScreen({ title, message, icon, showBack = true }: PlaceholderScreenProps) {
  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title={title} showBack={showBack} />
      <View style={styles.body}>
        <EmptyState icon={icon} title={title} message={message} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});
