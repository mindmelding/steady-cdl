import { useEffect, useState } from 'react';
import { goHome } from '../nav';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { copy } from '../copy';
import type { Question } from '../db/content/types';
import type { TestRun } from '../db/user/repos';
import { lightTap } from '../haptics';
import { useActivityScope } from '../state/activity';
import { finishRun } from '../state/runs';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { useSettingsStore } from '../state/settingsStore';
import { useTheme } from '../theme/theme';
import { badgeFor } from './QuestionScreen';
import { readAloudText } from './proofInfo';
import { QuestionView } from './QuestionView';
import { useReadAloud } from './useReadAloud';

/**
 * Unit check, practice test and the placement check: one question per screen, NO feedback until
 * the end (no Check button, no Proof sheet). Every pick is saved as it is made, so a killed app
 * resumes on the same question. Finishing writes attempts, Review changes and the sims row.
 */
export function RunScreen({ runId }: { runId: number }) {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useSettingsStore((s) => s.settings.haptics);
  const audio = useReadAloud();
  useActivityScope('test');
  const [state, setState] = useState<
    | {
        run: TestRun;
        items: { q: Question; i: number }[];
      }
    | 'missing'
    | null
  >(null);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const run = await getUserRepo().getRun(runId);
      if (!run) return live && setState('missing');
      const qs = await getContentRepo().getQuestions(run.questionIds);
      const byId = new Map(qs.map((q) => [q.id, q]));
      // Keep the drawn order (and each question's index in run.answers); skip any retired since.
      const items = run.questionIds
        .map((id, i) => ({ q: byId.get(id)!, i }))
        .filter((it) => !!it.q);
      if (live) setState({ run, items });
    })();
    return () => {
      live = false;
    };
  }, [runId]);

  // A run that is already finished only has results to show.
  useEffect(() => {
    if (state && state !== 'missing' && state.run.finished) router.replace(`/run/${runId}/results`);
  }, [state, router, runId]);

  if (state === 'missing' || (state && state.items.length === 0)) {
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
        <AppText variant="body">{copy.test.noQuestions}</AppText>
        <Button label={copy.test.back} onPress={() => goHome(router)} />
      </View>
    );
  }
  if (!state || state.run.finished)
    return <View style={{ flex: 1, backgroundColor: theme.color.bg }} />;

  const { run, items } = state;
  const step = Math.min(run.step, items.length - 1);
  const { q, i: answerIndex } = items[step];
  const placement = run.kind === 'placement';
  const labels = placement
    ? { next: copy.placement.next, finish: copy.placement.finish, close: copy.test.close }
    : { next: copy.test.next, finish: copy.test.finish, close: copy.test.close };

  const setRun = (next: Partial<TestRun>) => setState({ run: { ...run, ...next }, items });

  return (
    <QuestionView
      feedback={false}
      stem={q.question}
      options={q.options}
      answerIndex={q.answer_index}
      badge={badgeFor(q)}
      stepIndex={step}
      total={items.length}
      pick={run.answers[answerIndex] ?? null}
      checked={false}
      isLast={step === items.length - 1}
      flagged={flagged}
      speaking={audio.speaking}
      labels={labels}
      onSelect={(i) => {
        void lightTap(haptics);
        const answers = [...run.answers];
        answers[answerIndex] = i;
        setRun({ answers });
        void getUserRepo().saveRunAnswer(runId, answerIndex, i, step);
      }}
      onCheck={() => undefined}
      onContinue={async () => {
        audio.stop();
        setFlagged(false);
        if (step < items.length - 1) {
          await getUserRepo().setRunStep(runId, step + 1);
          setRun({ step: step + 1 });
        } else {
          await finishRun(runId);
          router.replace(`/run/${runId}/results`);
        }
      }}
      onClose={() => {
        audio.stop();
        if (router.canGoBack()) router.back();
        else goHome(router);
      }}
      onReadAloud={() => audio.toggle(readAloudText(q, false))}
      onFlag={() => setFlagged((f) => !f)}
    />
  );
}
