import { Tabs } from 'expo-router';
import { Platform, Pressable, type PressableProps, StyleSheet } from 'react-native';

import TabIcon from '@/components/ui/TabIcon';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: (props) => <Pressable {...(props as PressableProps)} android_ripple={null} />,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.background,
            alignItems: 'center',
            flexDirection: 'row',
            
          },
        ],
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={String(color)}
              title="Home"
              icon="home-5-line"
              activeIcon="home-5-fill"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={String(color)} title="Activity" icon="time-line" activeIcon="time-fill" />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={String(color)}
              title="Schedule"
              icon="calendar-schedule-line"
              activeIcon="calendar-schedule-fill"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={String(color)} title="Account" icon="user-3-line" activeIcon="user-3-fill" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // borderTopColor: 'transparent',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    // elevation: 16,
    height: Platform.OS === 'ios' ? 88 : 60,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    // shadowColor: Palette.cardShadow,
    // shadowOffset: { width: 0, height: -4 },
    // shadowOpacity: 0.08,
    // shadowRadius: 25,
  },
});
