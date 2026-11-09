import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { copy, stateName } from '../copy';
import { openPaywall } from '../state/activity';
import { loadHome, type HomeModel, type LessonNode, type TestNode } from '../state/homeModel';
import { computeReadiness, type ReadinessSummary } from '../state/readinessData';
import { usePurchasesStore } from '../state/purchasesStore';
import { useReviewStore } from '../state/reviewStore';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { startTest } from '../state/runs';
import { unitsForGoal } from '../domain/track';
import { HomeView } from './HomeView';

/** Home (S2): loads the track's path and readiness, and routes taps. */
export function LearnScreen() {
  const router = useRouter();
  const owned = usePurchasesStore((s) => s.owned);
  const [home, setHome] = useState<HomeModel | null>(null);
  const [readiness, setReadiness] = useState<ReadinessSummary>({ score: 0, units: [] });
  const [selected, setSelected] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let live = true;
      (async () => {
        const h = await loadHome(owned);
        if (!h) return;
        const content = getContentRepo();
        const units = unitsForGoal(await content.listUnits(h.track.contentState), h.track.goal);
        const r = await computeReadiness(content, getUserRepo(), h.track.contentState, units);
        await useReviewStore.getState().refresh();
        if (!live) return;
        setHome(h);
        setReadiness(r);
      })();
      return () => {
        live = false;
      };
      // `owned` changes after a purchase or restore: reload the locks.
    }, [owned]),
  );

  const locked = () => openPaywall(router.push, { source: 'locked_item' });

  const units = home?.units ?? [];
  const current =
    units.find((u) => u.unit.id === selected) ??
    units.find((u) => u.lessonsDone < u.lessonsTotal) ??
    units[0] ??
    null;

  const startLesson = (n: LessonNode) => router.push(`/lesson/${n.lessonId}/intro`);
  const startTestNode = async (n: TestNode) => {
    const id = await startTest(n.unitId, n.variant === 'practice' ? 'practice' : 'unit_check');
    if (id !== null) router.push(`/run/${id}`);
  };

  return (
    <HomeView
      trackLabel={
        home
          ? copy.home.trackLabel(
              home.track.picked === 'NAT'
                ? copy.onboarding.stateNameNational
                : stateName(home.track.picked),
              copy.home.goals[home.track.goal],
            )
          : ''
      }
      readiness={{ score: readiness.score, tick: readiness.tick }}
      unit={current}
      others={units.filter((u) => u !== current)}
      onSettings={() => router.push('/settings')}
      onLesson={startLesson}
      onTest={(n) => void startTestNode(n)}
      onLocked={locked}
      onSelectUnit={setSelected}
    />
  );
}
