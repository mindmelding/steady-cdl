import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { copy } from '../copy';
import { lessonOpen } from '../domain/access';
import { usePurchasesStore } from '../state/purchasesStore';
import { getContentRepo } from '../state/runtime';
import { getRunSummary, finishRun, type RunSummary } from '../state/runs';
import { useSettingsStore } from '../state/settingsStore';
import { useTheme } from '../theme/theme';
import { ResultsView } from './ResultsView';

/** Results for a unit check / practice test (S14) or the placement check. */
export function ResultsScreen({ runId }: { runId: number }) {
  const router = useRouter();
  const theme = useTheme();
  const owned = usePurchasesStore((s) => s.owned);
  const onboarded = useSettingsStore((s) => s.settings.onboarded);
  const [summary, setSummary] = useState<RunSummary | 'missing' | null>(null);
  const [lockedTestedOut, setLockedTestedOut] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      // finishRun is a no-op on a finished run, and finishes one that was left on its last answer.
      const s = (await finishRun(runId)) ?? (await getRunSummary(runId));
      if (!live) return;
      setSummary(s ?? 'missing');
      if (s && s.run.kind === 'placement') {
        const content = getContentRepo();
        let locked = 0;
        for (const id of s.testedOutLessonIds) {
          const lesson = await content.getLesson(id);
          const unit = lesson ? await content.getUnit(lesson.unit_id) : null;
          if (!lesson || !unit) continue;
          const lessons = await content.listLessons(unit.id);
          if (
            !lessonOpen(
              unit,
              lessons.findIndex((l) => l.id === id),
              owned,
            )
          )
            locked += 1;
        }
        if (live) setLockedTestedOut(locked);
      }
    })();
    return () => {
      live = false;
    };
  }, [runId, owned]);

  if (summary === null) return <View style={{ flex: 1, backgroundColor: theme.color.bg }} />;
  if (summary === 'missing') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.color.bg,
          padding: theme.space.page,
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <AppText variant="body">{copy.test.resultsMissing}</AppText>
        <Button label={copy.test.back} onPress={() => router.replace('/learn')} />
      </View>
    );
  }

  if (summary.run.kind === 'placement') {
    const out = summary.testedOutLessonIds.length;
    const misses = summary.score.missedIds.length;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.color.bg,
          padding: theme.space.page,
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <AppText variant="h1" accessibilityRole="header">
          {copy.placement.doneTitle}
        </AppText>
        <AppText variant="h2">
          {copy.placement.score(summary.score.right, summary.score.total)}
        </AppText>
        <AppText variant="body">{copy.placement.testedOut(out)}</AppText>
        {lockedTestedOut > 0 && (
          <AppText variant="body" color={theme.color.sub}>
            {copy.placement.lockedNote(lockedTestedOut)}
          </AppText>
        )}
        {misses > 0 && (
          <AppText variant="body" color={theme.color.sub}>
            {copy.placement.missesNote(misses)}
          </AppText>
        )}
        <Button
          label={copy.placement.continue}
          onPress={() => router.replace(onboarded ? '/learn' : '/onboarding/free')}
        />
      </View>
    );
  }

  const title =
    summary.run.kind === 'practice' ? copy.test.practiceTitle : copy.test.unitCheckTitle;
  return (
    <ResultsView
      title={`${title} · ${copy.test.resultsTitle}`}
      right={summary.score.right}
      total={summary.score.total}
      percent={summary.score.percent}
      passPct={summary.run.passPct ?? undefined}
      metPassMark={summary.metPassMark}
      rows={summary.items.map((it) => ({
        id: it.question.id,
        stem: it.question.question,
        correct: it.correct,
        answer: `${String.fromCharCode(65 + it.question.answer_index)} · ${it.question.options[it.question.answer_index]}`,
      }))}
      topics={summary.score.topics}
      onReplay={() =>
        router.push({ pathname: '/replay', params: { ids: summary.score.missedIds.join(',') } })
      }
      onBack={() => router.replace('/learn')}
    />
  );
}
