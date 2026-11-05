import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Fonts, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TrackingSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export default function TrackingSearch({
  value,
  onChange,
  onSubmit,
  placeholder = 'Enter Tracking Number',
}: TrackingSearchProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Icon name="search-line" size={20} color={theme.muted} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={theme.muted}
          style={[styles.input, { color: theme.text }]}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        {value ? (
          <Pressable onPress={() => onChange('')} hitSlop={8} accessibilityLabel="Clear tracking number">
            <Icon name="close-line" size={20} color={theme.muted} />
          </Pressable>
        ) : null}
      </View>
      <Pressable
        onPress={onSubmit}
        style={styles.searchBtn}
        accessibilityRole="button"
        accessibilityLabel="Track package">
        <Icon name="search-line" size={20} color="#000000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 37,
    marginTop: 14,
  },
  field: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 47,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  searchBtn: {
    alignItems: 'center',
    backgroundColor: Palette.searchYellow,
    borderRadius: 23,
    height: 47,
    justifyContent: 'center',
    width: 47,
  },
});
