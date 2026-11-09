import { useEffect, useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/AppText';
import { ChoiceCard } from '../../components/ChoiceCard';
import { copy, stateName } from '../../copy';
import { JURISDICTIONS, type Jurisdiction } from '../../db/content/types';
import { PINNED_STATES } from '../../domain/track';
import { getContentRepo } from '../../state/runtime';
import { useSettingsStore } from '../../state/settingsStore';
import { useTheme } from '../../theme/theme';
import { OnboardingShell } from './Shell';

/** All states, pinned ones first, national fallback on top. Other states map to NAT content. */
export function stateRows(query: string): {
  pinned: Jurisdiction[];
  rest: Jurisdiction[];
  national: boolean;
} {
  const q = query.trim().toLowerCase();
  const match = (code: Jurisdiction) =>
    q === '' || stateName(code).toLowerCase().includes(q) || code.toLowerCase() === q;
  const rest = JURISDICTIONS.filter((c) => c !== 'NAT' && !PINNED_STATES.includes(c))
    .filter(match)
    .sort((a, b) => stateName(a).localeCompare(stateName(b)));
  return {
    pinned: PINNED_STATES.filter(match),
    rest,
    national: q === '' || stateName('NAT').toLowerCase().includes(q) || 'not sure'.includes(q),
  };
}

export function StateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const picked = useSettingsStore((s) => s.settings.trackState) as Jurisdiction | null;
  const update = useSettingsStore((s) => s.update);
  const [query, setQuery] = useState('');
  const rows = useMemo(() => stateRows(query), [query]);
  const [have, setHave] = useState<Set<string> | null>(null);
  useEffect(() => {
    getContentRepo()
      .statesWithUnits()
      .then(setHave)
      .catch(() => setHave(new Set()));
  }, []);
  // A state without its own lessons studies the national ones; say so once it is picked.
  const noteFor = (c: Jurisdiction) =>
    picked === c && have && !have.has(c) ? copy.onboarding.natNote(stateName(c)) : undefined;
  const choose = (code: Jurisdiction) => void update({ trackState: code });
  const none = rows.pinned.length === 0 && rows.rest.length === 0 && !rows.national;

  return (
    <OnboardingShell
      step={1}
      continueDisabled={!picked}
      onContinue={() => router.push('/onboarding/goal')}
    >
      <AppText variant="h1" accessibilityRole="header">
        {copy.onboarding.stateTitle}
      </AppText>
      <AppText variant="body" color={theme.color.sub}>
        {copy.onboarding.stateBody}
      </AppText>
      <TextInput
        accessibilityLabel={copy.onboarding.searchLabel}
        placeholder={copy.onboarding.searchPlaceholder}
        placeholderTextColor={theme.color.sub}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
        style={{
          minHeight: theme.size.minTap + 8,
          borderWidth: theme.border.strong,
          borderColor: theme.color.ink,
          borderRadius: theme.radius.option,
          paddingHorizontal: 16,
          fontFamily: theme.text.option.fontFamily,
          fontSize: theme.text.option.fontSize,
          color: theme.color.ink,
        }}
      />
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {rows.pinned.length > 0 && (
          <AppText variant="meta" color={theme.color.sub} style={{ letterSpacing: 1.2 }}>
            {copy.onboarding.listPinned.toUpperCase()}
          </AppText>
        )}
        {rows.pinned.map((c) => (
          <ChoiceCard
            key={c}
            title={stateName(c)}
            body={noteFor(c)}
            selected={picked === c}
            onPress={() => choose(c)}
          />
        ))}
        {rows.national && (
          <ChoiceCard
            title={copy.onboarding.nationalOption}
            body={copy.onboarding.nationalBody}
            selected={picked === 'NAT'}
            onPress={() => choose('NAT')}
          />
        )}
        {rows.rest.length > 0 && (
          <AppText
            variant="meta"
            color={theme.color.sub}
            style={{ letterSpacing: 1.2, marginTop: 6 }}
          >
            {copy.onboarding.listAll.toUpperCase()}
          </AppText>
        )}
        {rows.rest.map((c) => (
          <ChoiceCard
            key={c}
            title={stateName(c)}
            body={noteFor(c)}
            selected={picked === c}
            onPress={() => choose(c)}
          />
        ))}
        {none && (
          <AppText variant="body" color={theme.color.sub}>
            {copy.onboarding.noMatch}
          </AppText>
        )}
      </View>
    </OnboardingShell>
  );
}
