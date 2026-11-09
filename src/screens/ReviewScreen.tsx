import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { track } from '../analytics';
import { dueLabel } from '../domain/dates';
import { useReviewStore } from '../state/reviewStore';
import { clock, getContentRepo, getUserRepo } from '../state/runtime';
import { ReviewView, type ReviewRow } from './ReviewView';

export function ReviewScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [dueCount, setDueCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let live = true;
      (async () => {
        const content = getContentRepo();
        const items = await getUserRepo().listReviewItems();
        const questions = await content.getQuestions(items.map((i) => i.questionId));
        const byId = new Map(questions.map((q) => [q.id, q]));
        const unitTitles = new Map<string, string>();
        for (const q of questions) {
          if (!unitTitles.has(q.unit_id)) {
            unitTitles.set(q.unit_id, (await content.getUnit(q.unit_id))?.title ?? '');
          }
        }
        const today = clock.today();
        const out: ReviewRow[] = [];
        for (const it of items) {
          const q = byId.get(it.questionId);
          if (!q) continue; // retired since it was missed
          out.push({
            id: q.id,
            unitTitle: unitTitles.get(q.unit_id) ?? '',
            topic: q.topic,
            due: dueLabel(it.dueDate, today),
          });
        }
        const due = out.filter((r) => r.due.kind === 'today').length;
        await useReviewStore.getState().refresh();
        if (!live) return;
        setRows(out);
        setDueCount(due);
        track('review_due_viewed', { n: due });
      })();
      return () => {
        live = false;
      };
    }, []),
  );

  return (
    <ReviewView
      rows={rows}
      dueCount={dueCount}
      onReplay={() =>
        router.push({ pathname: '/replay', params: { ids: rows.map((r) => r.id).join(',') } })
      }
    />
  );
}
