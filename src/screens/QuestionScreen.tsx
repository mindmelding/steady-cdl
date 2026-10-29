import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../components/AppText';
import { copy, stateName } from '../copy';
import type { Lesson, Question } from '../db/content/types';
import { lightTap } from '../haptics';
import { speak, stopSpeaking } from '../speech';
import { useActivityScope } from '../state/activity';
import { queueReport } from '../state/reports';
import { getContentRepo } from '../state/runtime';
import { useLessonStore } from '../state/lessonStore';
import { useSettingsStore } from '../state/settingsStore';
import { useTheme } from '../theme/theme';
import { proofInfoFor, readAloudText } from './proofInfo';
import { QuestionView } from './QuestionView';

type Loaded = { lesson: Lesson; questions: Question[] } | 'missing' | null;

export function badgeFor(q: Question): string {
  return q.state === 'NAT'
    ? copy.question.badgeFederal
    : copy.question.badgeStateOnly(stateName(q.state));
}

/** Question step of a lesson. Display state comes from saved progress, so it always resumes. */
export function QuestionScreen({ lessonId, step }: { lessonId: string; step: number }) {
  const router = useRouter();
  const theme = useTheme();
  useActivityScope('lesson');
  const settings = useSettingsStore((s) => s.settings);
  const progress = useLessonStore((s) => s.progress);
  const [data, setData] = useState<Loaded>(null);
  const [flagged, setFlagged] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const content = getContentRepo();
      const lesson = await content.getLesson(lessonId);
      const questions = lesson ? await content.getLessonQuestions(lessonId) : [];
      if (!live) return;
      if (!lesson || questions.length === 0) return setData('missing');
      const p = await useLessonStore.getState().load(lessonId);
      if (!live) return;
      setData({ lesson, questions });
      // Resume: if the URL step differs from saved progress, go to the saved step.
      if (p.done) router.replace(`/lesson/${lessonId}/complete`);
      else if (p.stepIndex !== step) router.replace(`/lesson/${lessonId}/${p.stepIndex}`);
    })();
    return () => {
      live = false;
      stopSpeaking();
    };
    // Load once per lesson; later step changes come from the store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const close = useCallback(() => {
    stopSpeaking();
    if (router.canGoBack()) router.back();
    else router.replace('/learn');
  }, [router]);

  if (data === 'missing') {
    return (
      <View
        style={{
          flex: 1,
          padding: theme.space.page,
          justifyContent: 'center',
          backgroundColor: theme.color.bg,
        }}
      >
        <AppText variant="body">{copy.question.notFound}</AppText>
      </View>
    );
  }
  if (!data || !progress || progress.lessonId !== lessonId || progress.done) {
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.color.bg }}
        accessibilityLabel={copy.question.loading}
      />
    );
  }

  const { questions } = data;
  const stepIndex = Math.min(progress.stepIndex, questions.length - 1);
  const q = questions[stepIndex];
  const store = useLessonStore.getState();

  return (
    <QuestionView
      stem={q.question}
      options={q.options}
      answerIndex={q.answer_index}
      badge={badgeFor(q)}
      stepIndex={stepIndex}
      total={questions.length}
      pick={progress.pendingPick}
      checked={progress.checked}
      isLast={stepIndex === questions.length - 1}
      flagged={flagged}
      speaking={speaking}
      proof={proofInfoFor(q)}
      onReport={(reason, note) => queueReport(q.id, reason, note)}
      onSelect={(i) => {
        void lightTap(settings.haptics);
        void store.select(i);
      }}
      onCheck={async () => {
        const ok = await store.check(q);
        void lightTap(settings.haptics);
        AccessibilityInfo.announceForAccessibility(
          ok ? copy.question.correct : copy.question.notQuite,
        );
      }}
      onContinue={async () => {
        stopSpeaking();
        setFlagged(false);
        await store.advance(questions.length);
        const p = useLessonStore.getState().progress!;
        router.replace(
          p.done ? `/lesson/${lessonId}/complete` : `/lesson/${lessonId}/${p.stepIndex}`,
        );
      }}
      onClose={close}
      onReadAloud={() => {
        if (speaking) {
          stopSpeaking();
          setSpeaking(false);
          return;
        }
        setSpeaking(true);
        speak(readAloudText(q, progress.checked), {
          rate: settings.speed,
          voice: settings.voice,
          onDone: () => setSpeaking(false),
        });
      }}
      onFlag={() => {
        setFlagged((f) => !f);
        AccessibilityInfo.announceForAccessibility(
          flagged ? copy.question.flag : copy.question.flagged,
        );
      }}
    />
  );
}
