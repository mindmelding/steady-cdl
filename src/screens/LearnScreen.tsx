import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Ring } from '../components/Ring';
import { copy } from '../copy';
import type { Lesson, Unit } from '../db/content/types';
import type { LessonProgress } from '../db/user/repos';
import { computeReadiness, type ReadinessSummary } from '../state/readinessData';
import { useReviewStore } from '../state/reviewStore';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { useLessonStore } from '../state/lessonStore';
import { useTheme } from '../theme/theme';

interface Row {
  unit: Unit;
  unitNumber: number;
  lesson: Lesson;
  progress: LessonProgress | null;
}

/** Minimal Learn tab (M1): the sample lesson with a Ring, plus the readiness ring. S2 is M2. */
export function LearnScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [readiness, setReadiness] = useState<ReadinessSummary>({ score: 0 });

  useFocusEffect(
    useCallback(() => {
      let live = true;
      (async () => {
        const content = getContentRepo();
        const user = getUserRepo();
        const units = await content.listUnits('NAT');
        const out: Row[] = [];
        for (const [i, unit] of units.entries()) {
          for (const lesson of await content.listLessons(unit.id)) {
            out.push({
              unit,
              unitNumber: i + 1,
              lesson,
              progress: await user.getProgress(lesson.id),
            });
          }
        }
        const r = await computeReadiness(content, user, 'NAT');
        await useReviewStore.getState().refresh();
        if (live) {
          setRows(out);
          setReadiness(r);
        }
      })();
      return () => {
        live = false;
      };
    }, []),
  );

  const start = async (row: Row) => {
    let p = row.progress;
    if (p?.done) p = await useLessonStore.getState().restart(row.lesson.id);
    router.push(`/lesson/${row.lesson.id}/${p?.stepIndex ?? 0}`);
  };

  const ringLabel =
    readiness.tick === undefined
      ? copy.learn.readiness(readiness.score)
      : copy.learn.readinessWithMark(readiness.score, Math.round(readiness.tick * 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, gap: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <AppText variant="h1" accessibilityRole="header" style={{ flexShrink: 1 }}>
            {copy.learn.title}
          </AppText>
          <Ring
            progress={readiness.score / 100}
            size={48}
            stroke={5}
            tick={readiness.tick}
            accessibilityLabel={ringLabel}
          >
            <AppText
              variant="meta"
              allowFontScaling={false}
              style={{ fontFamily: theme.text.h2.fontFamily, fontSize: 14 }}
            >
              {readiness.score}
            </AppText>
          </Ring>
        </View>

        {rows.length === 0 && <AppText variant="body">{copy.learn.emptyTitle}</AppText>}
        {rows.map((row) => {
          const total = row.lesson.step_ids.length;
          const p = row.progress;
          const done = !!p?.done;
          const started = !!p && !done && (p.stepIndex > 0 || p.pendingPick !== null);
          const fraction = done ? 1 : p ? p.stepIndex / total : 0;
          return (
            <View
              key={row.lesson.id}
              style={{
                borderWidth: theme.border.thin,
                borderColor: theme.color.line,
                borderRadius: theme.radius.card,
                padding: theme.space.card,
                gap: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Ring progress={fraction} size={44} stroke={4} dot={!done} />
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="meta" color={theme.color.sub}>
                    {copy.learn.unitLine(row.unit.title, row.unitNumber)}
                  </AppText>
                  <AppText variant="h2">{row.lesson.title}</AppText>
                  <AppText variant="meta" color={theme.color.sub}>
                    {copy.learn.lessonMeta(row.lesson.minutes, total)}
                  </AppText>
                </View>
              </View>
              <Button
                label={
                  done
                    ? copy.learn.redoLesson
                    : started
                      ? copy.learn.resumeLesson
                      : copy.learn.startLesson
                }
                onPress={() => void start(row)}
              />
            </View>
          );
        })}
        <AppText variant="meta" color={theme.color.sub}>
          {copy.learn.sampleNote}
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}
