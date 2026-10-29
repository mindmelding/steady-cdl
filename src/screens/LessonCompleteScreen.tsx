import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { copy } from '../copy';
import { lessonOpen } from '../domain/access';
import { openPaywall } from '../state/activity';
import { usePurchasesStore } from '../state/purchasesStore';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { useTheme } from '../theme/theme';
import { LessonCompleteView, type LessonCompleteViewProps } from './LessonCompleteView';

interface Loaded {
  view: Omit<LessonCompleteViewProps, 'onContinue' | 'onStop'>;
  unitTitle: string;
  next: { lessonId: string; open: boolean } | null;
}

export function LessonCompleteScreen({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const theme = useTheme();
  const owned = usePurchasesStore((s) => s.owned);
  const [data, setData] = useState<Loaded | 'missing' | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const content = getContentRepo();
      const user = getUserRepo();
      const lesson = await content.getLesson(lessonId);
      const unit = lesson ? await content.getUnit(lesson.unit_id) : null;
      if (!lesson || !unit) return live && setData('missing');
      const lessons = await content.listLessons(unit.id);
      const index = lessons.findIndex((l) => l.id === lessonId);
      const progress = await user.getProgress(lessonId);
      const done = await user.listDoneLessons();
      const nextLesson = lessons[index + 1];
      const nextOpen = nextLesson ? lessonOpen(unit, index + 1, owned) : false;
      const lessonsDone = lessons.filter((l) => done.has(l.id)).length;
      const questions = lesson.step_ids.length;
      const right = progress?.score ?? 0;
      const view = {
        number: index + 1,
        total: lessons.length,
        title: lesson.title,
        right,
        questions,
        seconds: progress?.seconds ?? 0,
        toReview: Math.max(0, questions - right),
        unitTitle: unit.title,
        lessonsDone,
        nextLine: nextLesson
          ? nextOpen
            ? copy.complete.nextLesson(nextLesson.title, nextLesson.minutes)
            : copy.complete.nextLocked(nextLesson.title)
          : copy.complete.unitDone,
      };
      if (live)
        setData({
          view,
          unitTitle: unit.title,
          next: nextLesson ? { lessonId: nextLesson.id, open: nextOpen } : null,
        });
    })();
    return () => {
      live = false;
    };
  }, [lessonId, owned]);

  if (data === 'missing') {
    return (
      <View
        style={{
          flex: 1,
          padding: theme.space.page,
          justifyContent: 'center',
          backgroundColor: theme.color.bg,
          gap: 16,
        }}
      >
        <AppText variant="body">{copy.question.notFound}</AppText>
        <Button label={copy.complete.back} onPress={() => router.replace('/learn')} />
      </View>
    );
  }
  if (!data) return <View style={{ flex: 1, backgroundColor: theme.color.bg }} />;

  return (
    <LessonCompleteView
      {...data.view}
      onStop={() => router.replace('/learn')}
      onContinue={() => {
        const next = data.next;
        if (!next) return router.replace('/learn');
        if (next.open) return router.replace(`/lesson/${next.lessonId}/intro`);
        // The free lesson is done and the next one is behind the unlock: the unit boundary.
        // The guard still applies (this screen is not a lesson, so it opens).
        router.replace('/learn');
        openPaywall(router.push, { source: 'unit_boundary', unit: data.unitTitle });
      }}
    />
  );
}
