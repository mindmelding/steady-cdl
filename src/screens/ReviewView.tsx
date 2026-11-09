import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CrossIcon } from '../components/icons';
import { Ring } from '../components/Ring';
import { copy } from '../copy';
import type { DueLabel } from '../domain/dates';
import { reviewMinutes } from '../domain/testRun';
import { useTheme } from '../theme/theme';

export interface ReviewRow {
  id: string;
  unitTitle: string;
  topic: string;
  due: DueLabel;
}

export function dueText(d: DueLabel): string {
  return d.kind === 'today'
    ? copy.review.dueToday
    : d.kind === 'tomorrow'
      ? copy.review.dueTomorrow
      : copy.review.dueInDays(d.n);
}

/** S7 Review mistakes (design/png/07-review-mistakes.png). Presentational. */
export function ReviewView({
  rows,
  dueCount,
  onReplay,
}: {
  rows: ReviewRow[];
  dueCount: number;
  onReplay: () => void;
}) {
  const theme = useTheme();
  const total = rows.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, paddingBottom: 28, gap: 16 }}>
        <AppText variant="h1" accessibilityRole="header">
          {copy.review.title}
        </AppText>
        {total === 0 ? (
          <AppText variant="body" color={theme.color.sub}>
            {copy.review.empty}
          </AppText>
        ) : (
          <>
            <View
              style={{
                borderWidth: theme.border.strong,
                borderColor: theme.color.ink,
                borderRadius: 20,
                padding: 18,
                gap: 14,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  columnGap: 12,
                }}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="h1">{copy.review.toFix(total)}</AppText>
                  <AppText variant="body" color={theme.color.sub}>
                    {dueCount > 0
                      ? copy.review.dueMeta(dueCount, reviewMinutes(dueCount))
                      : copy.review.noneDue}
                  </AppText>
                </View>
                <Ring
                  progress={dueCount / total}
                  size={56}
                  stroke={7}
                  accessibilityLabel={copy.review.ringLabel(dueCount, total)}
                >
                  <AppText
                    variant="meta"
                    allowFontScaling={false}
                    style={{ fontFamily: theme.text.h2.fontFamily, fontSize: 14 }}
                  >
                    {`${dueCount}/${total}`}
                  </AppText>
                </Ring>
              </View>
              <Button label={copy.review.replay(total)} onPress={onReplay} />
            </View>
            <AppText variant="body" color={theme.color.sub}>
              {copy.review.interval}
            </AppText>
            <View style={{ borderTopWidth: theme.border.thin, borderColor: theme.color.line }}>
              {rows.map((r) => {
                const today = r.due.kind === 'today';
                return (
                  <View
                    key={r.id}
                    accessible
                    accessibilityLabel={copy.review.itemLabel(r.unitTitle, r.topic, dueText(r.due))}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 14,
                      paddingVertical: 14,
                      borderBottomWidth: theme.border.thin,
                      borderColor: theme.color.line,
                    }}
                  >
                    <CrossIcon size={24} strokeWidth={3} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <AppText variant="meta" color={theme.color.sub} style={{ letterSpacing: 1 }}>
                        {r.unitTitle.toUpperCase()}
                      </AppText>
                      <AppText variant="option">{r.topic}</AppText>
                      <AppText
                        variant="body"
                        color={today ? theme.color.ink : theme.color.sub}
                        style={today ? { fontFamily: theme.text.question.fontFamily } : undefined}
                      >
                        {dueText(r.due)}
                      </AppText>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
