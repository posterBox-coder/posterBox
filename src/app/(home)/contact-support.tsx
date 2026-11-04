import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import FormScreen from '@/components/shared/FormScreen';
import Typography from '@/components/ui/Typography';
import { SUPPORT, SUPPORT_LINKS } from '@/constants/support';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ContactSupportScreen() {
  const theme = useTheme();

  const open = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <FormScreen title="Contact">
      <Typography size={22} weight="700">
        Contact Us!
      </Typography>
      <Typography size={14} textType="text2">
        Reach out to us. We love to hear from you.
      </Typography>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Pressable style={styles.row} onPress={() => open(SUPPORT.phoneUrl)}>
          <Icon name="phone-line" size={18} color={Palette.phoneGreen} />
          <Typography size={15}>{SUPPORT.phone}</Typography>
        </Pressable>
        <View style={[styles.line, { backgroundColor: theme.divider }]} />
        <Pressable style={styles.row} onPress={() => open(SUPPORT.emailUrl)}>
          <Icon name="mail-line" size={18} color={theme.text} />
          <Typography size={15} color={Palette.link} style={styles.underline}>
            {SUPPORT.email}
          </Typography>
        </Pressable>
        <View style={[styles.line, { backgroundColor: theme.divider }]} />
        <Pressable style={styles.row} onPress={() => open(SUPPORT.whatsappUrl)}>
          <Icon name="whatsapp-line" size={18} color={Palette.phoneGreen} />
          <Typography size={15} style={styles.grow}>
            WhatsApp
          </Typography>
          <Icon name="arrow-right-s-line" size={20} color={theme.text2} />
        </Pressable>
        {SUPPORT_LINKS.map((item) => (
          <View key={item.id}>
            <View style={[styles.line, { backgroundColor: theme.divider }]} />
            <Pressable style={styles.row} onPress={() => open(item.url)}>
              <Icon name={item.icon} size={18} color={theme.text} />
              <Typography size={15} style={styles.grow}>
                {item.label}
              </Typography>
              <Icon name="arrow-right-s-line" size={20} color={theme.text2} />
            </Pressable>
          </View>
        ))}
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 52,
  },
  line: {
    height: StyleSheet.hairlineWidth,
  },
  grow: {
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
