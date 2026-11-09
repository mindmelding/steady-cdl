import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CheckIcon, CrossIcon } from '../components/icons';
import { copy } from '../copy';
import type { TopicScore } from '../domain/testRun';
import { useTheme } from '../theme/theme';

export interface ResultRow {
  id: string;
  stem: string;
  /** null = left blank. */
  correct: boolean | null;
  /** "B · 60 psi" for misses. */
  answer: string;
}

export interface ResultsViewProps {
  title: string;
  right: number;
  total: number;
  percent: number;
  /** Set only when the run carries a verified pass mark. */
  passPct?: number;
  metPassMark?: boolean;
  rows: ResultRow[];
  topics: TopicScore[];
  onReplay: () => void;
  onBack: () => void;
}

/** S14 Results. Leads with "Replay N mistakes"; pass/fail only when a verified pass mark exists. */
export function ResultsView(p: ResultsViewProps) {
  const theme = useTheme();
  const missed = p.rows.filter((r) => r.correct !== true);
  const [filter, setFilter] = useState<'missed' | 'all'>('missed');
  const shown = filter === 'missed' ? missed : p.rows;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, paddingBottom: 24, gap: 16 }}>
        <AppText variant="h1" accessibilityRole="header">
          {p.title}
        </AppText>

        {missed.length > 0 ? (
          <Button label={copy.review.replay(missed.length)} onPress={p.onReplay} />
        ) : (
          <AppText variant="body">{copy.test.allRight}</AppText>
        )}

        <View
          accessible
          style={{
            borderWidth: theme.border.strong,
            borderColor: theme.color.ink,
            borderRadius: 20,
            padding: 18,
            gap: 8,
          }}
          accessibilityLabel={`${copy.test.score(p.right, p.total)}. ${p.percent}%`}
        >
          <AppText variant="h1">{copy.test.score(p.right, p.total)}</AppText>
          <AppText variant="h2" color={theme.color.sub}>
            {copy.test.percent(p.percent)}
          </AppText>
          {p.passPct !== undefined && p.metPassMark !== undefined ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
              {p.metPassMark ? (
                <CheckIcon size={26} strokeWidth={3} />
              ) : (
                <CrossIcon size={26} strokeWidth={3} />
              )}
              <AppText
                variant="body"
                style={{ flex: 1, fontFamily: theme.text.question.fontFamily }}
              >
                {p.metPassMark ? copy.test.passMet(p.passPct) : copy.test.passMissed(p.passPct)}
              </AppText>
            </View>
          ) : (
            <AppText variant="body" color={theme.color.sub}>
              {copy.test.noPassMark}
            </AppText>
          )}
        </View>

        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}
          accessibilityRole="tablist"
        >
          {(
            [
              ['missed', copy.test.filterMissed(missed.length)],
              ['all', copy.test.filterAll(p.rows.length)],
            ] as const
          ).map(([key, label]) => {
            const on = filter === key;
            return (
              <Pressable
                key={key}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: on }}
                onPress={() => setFilter(key)}
                style={{
                  minHeight: theme.size.minTap,
                  justifyContent: 'center',
                  paddingHorizontal: 18,
                  borderRadius: theme.radius.chip,
                  borderWidth: on ? theme.border.strong : theme.border.thin,
                  borderColor: on ? theme.color.ink : theme.color.line,
                  backgroundColor: on ? theme.color.soft : theme.color.bg,
                }}
              >
                <AppText
                  variant="body"
                  style={on ? { fontFamily: theme.text.question.fontFamily } : undefined}
                >
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={{ borderTopWidth: theme.border.thin, borderColor: theme.color.line }}>
          {shown.map((r) => (
            <View
              key={r.id}
              accessible
              accessibilityLabel={`${r.correct === true ? copy.test.rowRight : r.correct === null ? copy.test.rowSkipped : copy.test.rowMissed}. ${r.stem}${r.correct === true ? '' : `. ${copy.question.correctAnswer}: ${r.answer}`}`}
              style={{
                flexDirection: 'row',
                columnGap: 14,
                paddingVertical: 14,
                borderBottomWidth: theme.border.thin,
                borderColor: theme.color.line,
              }}
            >
              {r.correct === true ? (
                <CheckIcon size={24} strokeWidth={3} />
              ) : (
                <CrossIcon size={24} strokeWidth={3} />
              )}
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="meta" color={theme.color.sub}>
                  {r.correct === true
                    ? copy.test.rowRight
                    : r.correct === null
                      ? copy.test.rowSkipped
                      : copy.test.rowMissed}
                </AppText>
                <AppText variant="body">{r.stem}</AppText>
                {r.correct !== true && (
                  <AppText variant="body" color={theme.color.sub}>
                    {`${copy.question.correctAnswer}: ${r.answer}`}
                  </AppText>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 6 }}>
          <AppText variant="h2" accessibilityRole="header">
            {copy.test.topics}
          </AppText>
          {p.topics.map((t) => (
            <View
              key={t.topic}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                columnGap: 12,
                paddingVertical: 8,
                borderBottomWidth: theme.border.thin,
                borderColor: theme.color.line,
              }}
            >
              <AppText variant="body" style={{ flexShrink: 1 }}>
                {t.topic}
              </AppText>
              <AppText variant="body" style={{ fontFamily: theme.text.question.fontFamily }}>
                {copy.test.topicScore(t.right, t.total)}
              </AppText>
            </View>
          ))}
        </View>

        <Button label={copy.test.back} variant="secondary" onPress={p.onBack} />
      </ScrollView>
    </SafeAreaView>
  );
}
