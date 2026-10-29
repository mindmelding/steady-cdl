import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ChoiceCard } from '../components/ChoiceCard';
import { CheckIcon, ChevronIcon } from '../components/icons';
import { copy } from '../copy';
import { usePurchasesStore } from '../state/purchasesStore';
import { useSettingsStore } from '../state/settingsStore';
import { useTheme } from '../theme/theme';

/** Text size steps (multiplies on top of the system text size). */
export const TEXT_SIZES = [1, 1.15, 1.3];

export function ToggleRow({
  title,
  body,
  value,
  onChange,
}: {
  title: string;
  body: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={`${title}. ${body}`}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={{
        minHeight: theme.size.minTap + 16,
        borderRadius: theme.radius.card,
        borderWidth: value ? theme.border.strong : theme.border.thin,
        borderColor: value ? theme.color.ink : theme.color.line,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="h2">{title}</AppText>
        <AppText variant="body" color={theme.color.sub}>
          {body}
        </AppText>
      </View>
      {/* Icon + word, never colour alone. */}
      <View style={{ alignItems: 'center', gap: 4 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            borderWidth: 2.5,
            borderColor: theme.color.ink,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: value ? theme.color.ink : theme.color.bg,
          }}
        >
          {value ? <CheckIcon size={20} color={theme.color.bg} strokeWidth={3} /> : null}
        </View>
        <AppText variant="meta">{value ? copy.settings.on : copy.settings.off}</AppText>
      </View>
    </Pressable>
  );
}

/** S11 Settings: text size, Sun Mode, haptics, Restore. Every control works. */
export function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const restore = async () => {
    setRestoring(true);
    setRestoreMsg(copy.settings.restoring);
    const owned = await usePurchasesStore.getState().restore();
    setRestoring(false);
    setRestoreMsg(
      owned.size === 0
        ? copy.settings.nothingToRestore
        : copy.settings.restored([...owned].join(', ')),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, paddingBottom: 28, gap: 16 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.settings.back}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/learn'))}
          style={{
            minHeight: theme.size.minTap,
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 6,
          }}
        >
          <ChevronIcon dir="left" size={24} />
          <AppText variant="body">{copy.settings.back}</AppText>
        </Pressable>
        <AppText variant="h1" accessibilityRole="header">
          {copy.settings.title}
        </AppText>

        <View style={{ gap: 10 }} accessibilityRole="radiogroup">
          <AppText variant="h2">{copy.settings.textSize}</AppText>
          {TEXT_SIZES.map((size, i) => (
            <ChoiceCard
              key={size}
              title={copy.settings.textSizes[i]}
              selected={Math.abs(settings.textSize - size) < 0.01}
              onPress={() => void update({ textSize: size })}
            />
          ))}
        </View>

        <ToggleRow
          title={copy.settings.sunMode}
          body={copy.settings.sunModeBody}
          value={settings.sunMode}
          onChange={(v) => void update({ sunMode: v })}
        />
        <ToggleRow
          title={copy.settings.haptics}
          body={copy.settings.hapticsBody}
          value={settings.haptics}
          onChange={(v) => void update({ haptics: v })}
        />

        <View style={{ gap: 10 }}>
          <AppText variant="body" color={theme.color.sub}>
            {copy.settings.restoreBody}
          </AppText>
          <Button
            label={copy.settings.restore}
            variant="secondary"
            disabled={restoring}
            onPress={() => void restore()}
          />
          {restoreMsg && (
            <AppText variant="body" accessibilityLiveRegion="polite">
              {restoreMsg}
            </AppText>
          )}
        </View>

        <AppText variant="meta" color={theme.color.sub}>
          {copy.settings.disclaimer}
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}
