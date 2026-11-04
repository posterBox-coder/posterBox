import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Icon, { type IconName } from 'react-native-remix-icon';

import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useSession } from '@/providers/session-provider';
import { useTheme } from '@/hooks/use-theme';
import { push } from '@/utils/nav';

const MENU: { icon: IconName; title: string; subtitle: string; href?: '/(home)/notifications' | '/(home)/contact-support' | '/(home)/payout-account' }[] = [
  { icon: 'user-3-line', title: 'Profile', subtitle: 'View and update your details' },
  { icon: 'bank-card-line', title: 'Payout', subtitle: 'Bank account for delivery earnings', href: '/(home)/payout-account' },
  { icon: 'notification-3-line', title: 'Notifications', subtitle: 'Manage delivery alerts', href: '/(home)/notifications' },
  { icon: 'shield-user-line', title: 'Security', subtitle: 'Password and account safety' },
  { icon: 'customer-service-2-line', title: 'Help', subtitle: 'Get support from PosterBox', href: '/(home)/contact-support' },
];

export default function AccountScreen() {
  const theme = useTheme();
  const { session, signOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/onboarding');
  };

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Account" showBack={false} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.profile, { backgroundColor: theme.homeCard }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Typography size={20} weight="700" color={Palette.white}>
              {(session?.name ?? 'P').charAt(0).toUpperCase()}
            </Typography>
          </View>
          <View style={styles.profileCopy}>
            <Typography size={18} weight="700">
              {session?.name ?? 'PosterBox user'}
            </Typography>
            <Typography size={13} textType="text2">
              {session?.email ?? ''}
            </Typography>
          </View>
        </View>

        <View style={styles.menu}>
          {MENU.map((item) => (
            <Pressable
              key={item.title}
              style={[styles.menuItem, { borderColor: theme.borderColor }]}
              onPress={() => {
                if (item.href) {
                  push(item.href);
                }
              }}>
              <Icon name={item.icon} size={22} color={theme.primary} />
              <View style={styles.menuCopy}>
                <Typography size={15} weight="600">
                  {item.title}
                </Typography>
                <Typography size={12} textType="text2">
                  {item.subtitle}
                </Typography>
              </View>
              <Icon name="arrow-right-s-line" size={20} color={theme.muted} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <AppButton title="Sign out" variant="secondary" handlePress={handleSignOut} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profile: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  menu: {
    marginTop: 16,
  },
  menuItem: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  menuCopy: {
    flex: 1,
    gap: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
});
