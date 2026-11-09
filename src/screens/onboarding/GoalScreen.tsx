import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/AppText';
import { ChevronIcon } from '../../components/icons';
import { ChoiceCard } from '../../components/ChoiceCard';
import { Ring } from '../../components/Ring';
import { copy, stateName } from '../../copy';
import type { Jurisdiction } from '../../db/content/types';
import { languageClaim } from '../../domain/formatClaims';
import { type Goal } from '../../domain/track';
import { getContentRepo } from '../../state/runtime';
import { startPlacement } from '../../state/runs';
import { useSettingsStore } from '../../state/settingsStore';
import { useTheme } from '../../theme/theme';
import { OnboardingShell, StateChip } from './Shell';

export function StateChipFromSettings() {
  const picked = useSettingsStore((s) => s.settings.trackState) as Jurisdiction | null;
  const [english, setEnglish] = useState(false);
  useEffect(() => {
    if (!picked) return;
    getContentRepo()
      .listStateFormats(picked)
      .then((rows) => setEnglish(languageClaim(rows)))
      .catch(() => setEnglish(false));
  }, [picked]);
  if (!picked) return null;
  const name = picked === 'NAT' ? copy.onboarding.stateNameNational : stateName(picked);
  return (
    <StateChip text={english ? copy.onboarding.chipEnglish(name) : copy.onboarding.chip(name)} />
  );
}

/** S1 step 2: the goal, and the optional 2-minute placement check. */
export function GoalScreen() {
  const theme = useTheme();
  const router = useRouter();
  const picked = useSettingsStore((s) => s.settings.trackState);
  const goal = useSettingsStore((s) => s.settings.goal);
  const update = useSettingsStore((s) => s.update);
  const [noQuestions, setNoQuestions] = useState(false);

  const goals: { key: Goal; title: string; body: string }[] = [
    {
      key: 'permit',
      title: copy.onboarding.goalPermit,
      body: picked === 'TX' ? copy.onboarding.goalPermitBodyTx : copy.onboarding.goalPermitBody,
    },
    {
      key: 'endorsement',
      title: copy.onboarding.goalEndorsement,
      body: copy.onboarding.goalEndorsementBody,
    },
    {
      key: 'hazmat_renewal',
      title: copy.onboarding.goalRenewal,
      body: copy.onboarding.goalRenewalBody,
    },
  ];
  const current = goal ?? 'permit';

  const takeCheck = async () => {
    // The check is optional and never blocks: it samples the units of the goal chosen above.
    if (!goal) await update({ goal: current });
    const id = await startPlacement();
    if (id === null) return setNoQuestions(true);
    router.push(`/run/${id}`);
  };

  return (
    <OnboardingShell
      step={2}
      backTo="/onboarding/state"
      onContinue={async () => {
        if (!goal) await update({ goal: current });
        router.push('/onboarding/free');
      }}
      footer={
        <View style={{ gap: 6 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${copy.onboarding.placementTitle} ${copy.onboarding.placementBody}`}
            onPress={() => void takeCheck()}
            style={{
              borderWidth: theme.border.thin,
              borderColor: theme.color.line,
              borderRadius: theme.radius.card,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 14,
              minHeight: theme.size.minTap + 24,
            }}
          >
            <Ring progress={0.8} size={44} stroke={5} dot />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="question" style={{ fontSize: theme.text.h2.fontSize }}>
                {copy.onboarding.placementTitle}
              </AppText>
              <AppText variant="body" color={theme.color.sub}>
                {copy.onboarding.placementBody}
              </AppText>
            </View>
            <ChevronIcon size={22} />
          </Pressable>
          {noQuestions && (
            <AppText variant="body" color={theme.color.sub} accessibilityLiveRegion="polite">
              {copy.placement.noQuestions}
            </AppText>
          )}
        </View>
      }
    >
      <StateChipFromSettings />
      <AppText variant="h1" accessibilityRole="header">
        {copy.onboarding.goalTitle}
      </AppText>
      <AppText variant="body" color={theme.color.sub}>
        {copy.onboarding.goalBody}
      </AppText>
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {goals.map((g) => (
          <ChoiceCard
            key={g.key}
            title={g.title}
            body={g.body}
            selected={current === g.key}
            onPress={() => void update({ goal: g.key })}
          />
        ))}
      </View>
    </OnboardingShell>
  );
}
