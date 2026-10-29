import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { CalendarIcon, CrossIcon, SpeakerIcon } from '../../src/components/icons';
import { Ring } from '../../src/components/Ring';
import { copy } from '../../src/copy';
import { useReviewStore } from '../../src/state/reviewStore';
import { TAB_MAX_SCALE, useTheme } from '../../src/theme/theme';

// Every tab label is icon + word (CLAUDE.md §3.1).
function TabLabel({ text, focused }: { text: string; focused: boolean }) {
  const theme = useTheme();
  return (
    // Wraps and centres instead of running into the next tab at large text sizes.
    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
      <AppText
        variant="tab"
        // Tab labels are chrome, not reading text: capped like the system tab bar.
        // eslint-disable-next-line no-restricted-syntax
        maxFontSizeMultiplier={TAB_MAX_SCALE}
        color={focused ? theme.color.ink : theme.color.sub}
        style={{ textAlign: 'center' }}
      >
        {text}
      </AppText>
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();
  const total = useReviewStore((s) => s.total);
  const reviewLabel = total > 0 ? `${copy.tabs.review} · ${total}` : copy.tabs.review;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.ink,
        tabBarInactiveTintColor: theme.color.sub,
        tabBarStyle: {
          backgroundColor: theme.color.bg,
          borderTopColor: theme.color.line,
          minHeight: theme.size.tabH,
        },
        tabBarItemStyle: { paddingTop: 6, minWidth: 0 },
      }}
    >
      <Tabs.Screen
        name="learn"
        options={{
          title: copy.tabs.learn,
          tabBarLabel: ({ focused }) => <TabLabel text={copy.tabs.learn} focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <Ring
              progress={0.78}
              size={22}
              stroke={3}
              dot
              color={focused ? theme.color.ink : theme.color.sub}
              track={theme.color.track}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: reviewLabel,
          tabBarLabel: ({ focused }) => <TabLabel text={reviewLabel} focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <CrossIcon
              size={22}
              color={focused ? theme.color.ink : theme.color.sub}
              strokeWidth={2.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="test-day"
        options={{
          title: copy.tabs.testDay,
          tabBarLabel: ({ focused }) => <TabLabel text={copy.tabs.testDay} focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <CalendarIcon size={22} color={focused ? theme.color.ink : theme.color.sub} />
          ),
        }}
      />
      <Tabs.Screen
        name="cab"
        options={{
          title: copy.tabs.cab,
          tabBarLabel: ({ focused }) => <TabLabel text={copy.tabs.cab} focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <SpeakerIcon size={22} color={focused ? theme.color.ink : theme.color.sub} />
          ),
        }}
      />
    </Tabs>
  );
}
