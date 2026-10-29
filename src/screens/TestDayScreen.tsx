import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { unitsForGoal } from '../domain/track';
import { computeReadiness, type ReadinessSummary } from '../state/readinessData';
import { getContentRepo, getUserRepo } from '../state/runtime';
import { loadTrack } from '../state/track';
import { TestDayView } from './TestDayView';

export function TestDayScreen() {
  const [r, setR] = useState<ReadinessSummary>({ score: 0, units: [] });

  useFocusEffect(
    useCallback(() => {
      let live = true;
      (async () => {
        const track = await loadTrack();
        if (!track) return;
        const content = getContentRepo();
        const units = unitsForGoal(await content.listUnits(track.contentState), track.goal);
        const summary = await computeReadiness(content, getUserRepo(), track.contentState, units);
        if (live) setR(summary);
      })();
      return () => {
        live = false;
      };
    }, []),
  );

  return (
    <TestDayView
      score={r.score}
      tick={r.tick}
      sections={r.units.map((u) => ({
        id: u.unit.id,
        title: u.unit.title,
        score: u.score,
        tick: u.tick,
      }))}
    />
  );
}
