import { StyleSheet, View } from 'react-native';
import Icon, { type IconName } from 'react-native-remix-icon';

import Typography from '@/components/ui/Typography';

type TabIconProps = {
  focused: boolean;
  color: string;
  icon: IconName;
  activeIcon?: IconName;
  title: string;
};

export default function TabIcon({ focused, color, icon, activeIcon, title }: TabIconProps) {
  return (
    <View style={styles.wrap}>
      <Icon name={focused ? (activeIcon ?? icon) : icon} size={24} color={color} />
      <Typography size={10} weight={focused ? '600' : '500'} color={color} numberOfLines={1}>
        {title}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 2,
    justifyContent: 'center',
    minWidth: 64,
    paddingTop: 4,
  },
});
