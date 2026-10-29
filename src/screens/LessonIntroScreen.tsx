import { useEffect, useState } from 'react';
import { goHome } from '../nav';
import { useRouter } from 'expo-router';
import { copy, stateName } from '../copy';
import type { Lesson, StateFormat, Unit } from '../db/content/types';
import type { LessonProgress } from '../db/user/repos';
import { lessonOpen } from '../domain/access';
import { formatClaims } from '../domain/formatClaims';
import { formatCitation } from '../domain/citations';
import { speak, stopSpeaking } from '../speech';
import { openPaywall } from '../state/activity';
import { useLessonStore } from '../state/lessonStore';
import { usePurchasesStore } from '../state/purchasesStore';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { useSettingsStore } from '../state/settingsStore';
import { LessonIntroView } from './LessonIntroView';

interface Loaded {
  lesson: Lesson;
  unit: Unit;
  index: number;
  total: number;
  progress: LessonProgress | null;
  format: StateFormat | null;
  done: boolean;
}

export function LessonIntroScreen({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const owned = usePurchasesStore((s) => s.owned);
  const settings = useSettingsStore((s) => s.settings);
  const [data, setData] = useState<Loaded | 'missing' | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const content = getContentRepo();
      const lesson = await content.getLesson(lessonId);
      const unit = lesson ? await content.getUnit(lesson.unit_id) : null;
      if (!lesson || !unit) return live && setData('missing');
      const lessons = await content.listLessons(unit.id);
      const index = lessons.findIndex((l) => l.id === lessonId);
      const user = getUserRepo();
      const progress = await user.getProgress(lessonId);
      const doneSet = await user.listDoneLessons();
      const format = await content.getStateFormat(unit.state, unit.section);
      if (live)
        setData({
          lesson,
          unit,
          index,
          total: lessons.length,
          progress,
          format,
          done: doneSet.get(lessonId) === 'completed' || !!progress?.done,
        });
    })();
    return () => {
      live = false;
      stopSpeaking();
    };
  }, [lessonId]);

  // A locked lesson never shows here: send the learner to the (guarded) paywall instead.
  const locked = data && data !== 'missing' ? !lessonOpen(data.unit, data.index, owned) : false;
  useEffect(() => {
    if (locked) {
      if (!openPaywall(router.replace, { source: 'locked_item' })) goHome(router);
    }
  }, [locked, router]);

  if (!data || data === 'missing' || locked) return null;
  const { lesson, unit, progress } = data;
  const claims = formatClaims(data.format);
  const started =
    !!progress && !progress.done && (progress.stepIndex > 0 || progress.pendingPick !== null);

  const close = () => {
    stopSpeaking();
    if (router.canGoBack()) router.back();
    else goHome(router);
  };

  return (
    <LessonIntroView
      unitTitle={unit.title}
      number={data.index + 1}
      total={data.total}
      title={lesson.title}
      minutes={lesson.minutes}
      questions={lesson.step_ids.length}
      onStateTest={claims.onStateTest ? copy.lesson.onStateTest(stateName(unit.state)) : undefined}
      why={lesson.why}
      keyFacts={lesson.key_facts}
      startLabel={
        data.done
          ? copy.learn.redoLesson
          : started
            ? copy.learn.resumeLesson
            : copy.learn.startLesson
      }
      speaking={speaking}
      onClose={close}
      onReadAloud={() => {
        if (speaking) {
          stopSpeaking();
          setSpeaking(false);
          return;
        }
        const facts = lesson.key_facts
          .map((f) => `${f.label}. ${f.text}. ${formatCitation(f.citation)}.`)
          .join(' ');
        setSpeaking(true);
        speak(`${lesson.title}. ${lesson.why.replace(/\*\*/g, '')} ${facts}`, {
          rate: settings.speed,
          voice: settings.voice,
          onDone: () => setSpeaking(false),
        });
      }}
      onStart={async () => {
        stopSpeaking();
        let step = progress?.stepIndex ?? 0;
        if (data.done || progress?.done) {
          await useLessonStore.getState().restart(lessonId);
          step = 0;
        }
        router.replace(`/lesson/${lessonId}/${step}`);
      }}
    />
  );
}
