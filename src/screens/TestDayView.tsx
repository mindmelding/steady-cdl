import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Ring } from '../components/Ring';
import { copy } from '../copy';
import { readinessLabel, type ReadinessLabel } from '../domain/readiness';
import { useTheme } from '../theme/theme';

export interface SectionBar {
  id: string;
  title: string;
  score: number;
  /** Pass mark as a fraction; only when the format is verified. */
  tick?: number;
}

const LABELS: Record<ReadinessLabel, string> = {
  likely_ready: copy.testDay.likelyReady,
  almost_there: copy.testDay.almostThere,
  getting_started: copy.testDay.gettingStarted,
};

/** S8 Test Day, simple version (design/png/08-readiness-test-day.png): the ring and section bars. */
export function TestDayView({
  score,
  tick,
  sections,
}: {
  score: number;
  tick?: number;
  sections: SectionBar[];
}) {
  const theme = useTheme();
  const label =
    tick === undefined
      ? copy.testDay.ringLabel(score)
      : copy.testDay.ringLabelMark(score, Math.round(tick * 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, paddingBottom: 28, gap: 18 }}>
        <AppText variant="h1" accessibilityRole="header">
          {copy.testDay.title}
        </AppText>
        {sections.length === 0 ? (
          <AppText variant="body" color={theme.color.sub}>
            {copy.testDay.empty}
          </AppText>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 20,
                rowGap: 12,
              }}
            >
              <Ring
                progress={score / 100}
                size={120}
                stroke={12}
                tick={tick}
                accessibilityLabel={label}
              >
                <View style={{ alignItems: 'center' }}>
                  <AppText
                    variant="h1"
                    allowFontScaling={false}
                    style={{ fontSize: 40, lineHeight: 44 }}
                  >
                    {score}
                  </AppText>
                  <AppText
                    variant="meta"
                    allowFontScaling={false}
                    color={theme.color.sub}
                    style={{ fontSize: 14 }}
                  >
                    {copy.testDay.ready}
                  </AppText>
                </View>
              </Ring>
              <View style={{ flex: 1, flexBasis: 180, gap: 6 }}>
                <AppText variant="h2">{LABELS[readinessLabel(score)]}</AppText>
                <AppText variant="body" color={theme.color.sub}>
                  {tick === undefined
                    ? copy.testDay.noTickNote
                    : copy.testDay.tickNote(Math.round(tick * 100))}
                </AppText>
              </View>
            </View>

            <View
              style={{
                borderWidth: theme.border.thin,
                borderColor: theme.color.line,
                borderRadius: theme.radius.card,
                padding: 18,
                gap: 18,
              }}
            >
              {sections.map((s) => (
                <View
                  key={s.id}
                  accessible
                  accessibilityLabel={copy.testDay.sectionScore(s.title, s.score)}
                  style={{ gap: 8 }}
                >
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: 12 }}
                  >
                    <AppText variant="body" style={{ flexShrink: 1 }}>
                      {s.title}
                    </AppText>
                    <AppText variant="body" style={{ fontFamily: theme.text.question.fontFamily }}>
                      {s.score}
                    </AppText>
                  </View>
                  <View style={{ height: 14, justifyContent: 'center' }}>
                    <View
                      style={{ height: 8, borderRadius: 4, backgroundColor: theme.color.track }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        height: 8,
                        borderRadius: 4,
                        width: `${Math.min(100, Math.max(0, s.score))}%`,
                        backgroundColor: theme.color.ink,
                      }}
                    />
                    {s.tick !== undefined && (
                      <View
                        style={{
                          position: 'absolute',
                          left: `${s.tick * 100}%`,
                          width: 2.5,
                          height: 14,
                          backgroundColor: theme.color.ink,
                        }}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
            <AppText variant="body" color={theme.color.sub}>
              {copy.testDay.studyGuide}
            </AppText>
            <AppText variant="meta" color={theme.color.sub}>
              {copy.testDayFooter}
            </AppText>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
