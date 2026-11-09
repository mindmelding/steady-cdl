import { useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { copy } from '../copy';
import type { Question } from '../db/content/types';
import { lightTap } from '../haptics';
import { useActivityScope } from '../state/activity';
import { recordAnswer } from '../state/answers';
import { queueReport } from '../state/reports';
import { useReviewStore } from '../state/reviewStore';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { useSettingsStore } from '../state/settingsStore';
import { track } from '../analytics';
import { useTheme } from '../theme/theme';
import { badgeFor } from './QuestionScreen';
import { proofInfoFor, readAloudText } from './proofInfo';
import { QuestionView } from './QuestionView';
import { useReadAloud } from './useReadAloud';

/**
 * Replay mistakes (from Review or from Results): the questions again, one at a time, with a Proof
 * sheet after each. Every answer updates the Review queue (1, 2, 4 days; leaves after 3 right in a row).
 * The queue is the saved state, so closing midway loses nothing.
 */
export function ReplayScreen({ ids }: { ids: string[] }) {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useSettingsStore((s) => s.settings.haptics);
  const audio = useReadAloud();
  useActivityScope('review');
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [right, setRight] = useState(0);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    let live = true;
    getContentRepo()
      .getQuestions(ids)
      .then((qs) => live && setQuestions(qs));
    return () => {
      live = false;
    };
    // ids is a stable route param
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  const leave = () => {
    audio.stop();
    if (router.canGoBack()) router.back();
    else router.replace('/review');
  };

  if (!questions) return <View style={{ flex: 1, backgroundColor: theme.color.bg }} />;

  if (questions.length === 0 || step >= questions.length) {
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
          {copy.review.replayDoneTitle}
        </AppText>
        <AppText variant="body">
          {questions.length === 0
            ? copy.test.noQuestions
            : copy.review.replayDone(right, questions.length)}
        </AppText>
        <Button label={copy.review.replayBack} onPress={leave} />
      </View>
    );
  }

  const q = questions[step];
  return (
    <QuestionView
      stem={q.question}
      options={q.options}
      answerIndex={q.answer_index}
      badge={badgeFor(q)}
      stepIndex={step}
      total={questions.length}
      pick={pick}
      checked={checked}
      isLast={step === questions.length - 1}
      flagged={flagged}
      speaking={audio.speaking}
      labels={{
        next: copy.test.next,
        finish: copy.review.finishReplay,
        close: copy.review.closeReplay,
      }}
      proof={proofInfoFor(q)}
      onReport={(reason, note) => queueReport(q.id, reason, note)}
      onSelect={(i) => {
        if (checked) return;
        void lightTap(haptics);
        setPick(i);
      }}
      onCheck={async () => {
        if (pick === null) return;
        const repo = getUserRepo();
        const ok = await repo.transaction(() => recordAnswer(repo, q, pick, 'review'));
        await useReviewStore.getState().refresh();
        track('question_answered', { question_id: q.id, correct: ok });
        if (ok) setRight((r) => r + 1);
        setChecked(true);
        void lightTap(haptics);
        AccessibilityInfo.announceForAccessibility(
          ok ? copy.question.correct : copy.question.notQuite,
        );
      }}
      onContinue={() => {
        audio.stop();
        setFlagged(false);
        setPick(null);
        setChecked(false);
        setStep(step + 1);
      }}
      onClose={leave}
      onReadAloud={() => audio.toggle(readAloudText(q, checked))}
      onFlag={() => setFlagged((f) => !f)}
    />
  );
}
