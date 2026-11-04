import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CodeCardProps = {
  code: string;
  shareMessage?: string;
};

export default function CodeCard({ code, shareMessage }: CodeCardProps) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
  };

  return (
    <View style={[styles.card, { borderColor: theme.text }]}>
      <Typography size={20} weight="500" style={styles.code} selectable>
        {code}
      </Typography>
      <Pressable onPress={copy} hitSlop={8} accessibilityRole="button" accessibilityLabel={copied ? 'Copied' : 'Copy code'}>
        <Icon
          name={copied ? 'check-line' : 'file-copy-line'}
          size={24}
          color={copied ? Palette.successGreen : theme.text}
        />
      </Pressable>
      <Pressable
        onPress={() => Share.share({ message: shareMessage ?? code })}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Share code">
        <Icon name="share-line" size={24} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 20,
  },
  code: {
    letterSpacing: 0.5,
    marginRight: 4,
  },
});
