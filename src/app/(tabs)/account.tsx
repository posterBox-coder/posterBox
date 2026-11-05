import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { useMe } from '@/api/hooks/use-account';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';
import Typography from '@/components/ui/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useKyc } from '@/providers/kyc-provider';
import { useSession } from '@/providers/session-provider';
import { push } from '@/utils/nav';

const BLUE = '#3C37F2';

export default function AccountScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const { session, signOut } = useSession();
  const { data: me } = useMe();
  const { status } = useKyc();
  const name = session?.name || me?.fullName || 'PosterBox user';
  const verified = status === 'verified' || (me?.isVerifiedTraveler ?? false);
  const borderColor = scheme === 'dark' ? theme.divider : '#E6E6E6';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/onboarding');
  };

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Account" showBack={false} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Typography size={36} weight="600" color="#FFFFFF">
              {name.charAt(0).toUpperCase()}
            </Typography>
          </View>
          <Typography size={18} weight="700" align="center">
            {name}
          </Typography>
        </View>

        <View style={[styles.card, styles.row, { backgroundColor: theme.surface, borderColor }]}>
          <Typography size={15} weight="500">
            Status
          </Typography>
          {verified ? (
            <View style={styles.status}>
              <Icon name="checkbox-circle-fill" size={18} color={BLUE} />
              <Typography size={14} weight="500">
                Verified
              </Typography>
            </View>
          ) : (
            <Typography size={14} weight="500" textType="text3">
              Unverified
            </Typography>
          )}
        </View>

        <Pressable
          onPress={() => push('/(home)/enter-delivery-code')}
          style={[styles.card, styles.row, styles.gap, { backgroundColor: theme.surface, borderColor }]}
          accessibilityRole="button">
          <Typography size={15} weight="500" style={styles.grow}>
            Enter Delivery Code
          </Typography>
          <Icon name="arrow-right-s-line" size={22} color={theme.text2} />
        </Pressable>

        <View style={[styles.card, styles.gap, { backgroundColor: theme.surface, borderColor }]}>
          <MenuLink title="Edit Account" onPress={() => push('/(home)/edit-profile')} borderColor={borderColor} />
          <MenuLink title="Card Settings" onPress={() => push('/(home)/card-settings')} borderColor={borderColor} />
          <MenuLink title="Update KYC" onPress={() => push('/(home)/update-kyc')} borderColor={borderColor} />
          <MenuLink title="Contact Support" onPress={() => push('/(home)/contact-support')} borderColor={borderColor} />
          <Pressable onPress={handleSignOut} style={styles.row} accessibilityRole="button" accessibilityLabel="log out">
            <Typography size={15} weight="500">
              Log out
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function MenuLink({ title, onPress, borderColor }: { title: string; onPress: () => void; borderColor: string }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, styles.divider, { borderBottomColor: borderColor }]}
      accessibilityRole="button">
      <Typography size={15} weight="500" style={styles.grow}>
        {title}
      </Typography>
      <Icon name="arrow-right-s-line" size={22} color={theme.text2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  profile: {
    alignItems: 'center',
    gap: 14,
    paddingBottom: 22,
    paddingTop: 28,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: BLUE,
    borderRadius: 46,
    height: 92,
    justifyContent: 'center',
    width: 92,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gap: {
    marginTop: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  grow: {
    flex: 1,
  },
  status: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});
