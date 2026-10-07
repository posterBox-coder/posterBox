import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import Wrapper from '@/components/utilities/Wrapper';

export default function Login() {
  return (
    <Wrapper>
      <View style={styles.screen}>
        <Typography size={28} weight="700" lineHeight={36}>
          Login
        </Typography>
        <Typography size={15} weight="400" textType="text2" lineHeight={22} style={styles.subtitle}>
          Welcome back. Sign in to continue.
        </Typography>
        <View style={styles.actions}>
          <AppButton title="Back" variant="secondary" handlePress={() => router.back()} />
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
  },
  subtitle: {
    marginTop: 8,
  },
  actions: {
    marginTop: 'auto',
    marginBottom: 8,
  },
});
