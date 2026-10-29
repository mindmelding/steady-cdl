import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CheckIcon } from '../components/icons';
import { Ring } from '../components/Ring';
import { copy } from '../copy';
import { mmss } from '../domain/dates';
import { useGlyphScale, useTheme } from '../theme/theme';

export interface LessonCompleteViewProps {
  number: number;
  total: number;
  title: string;
  right: number;
  questions: number;
  seconds: number;
  toReview: number;
  unitTitle: string;
  lessonsDone: number;
  /** Text under the unit title: the next lesson, or that the lessons are done. */
  nextLine: string;
  onContinue: () => void;
  onStop: () => void;
}

/** S6 Lesson complete (design/png/06-lesson-complete.png). No confetti, XP or streak. */
export function LessonCompleteView(p: LessonCompleteViewProps) {
  const theme = useTheme();
  const k = Math.min(useGlyphScale(), 1.6);
  const big = {
    fontFamily: theme.text.h1.fontFamily,
    fontSize: theme.text.h1.fontSize,
    lineHeight: theme.text.h1.lineHeight,
  };

  const stats: { value: string; suffix?: string; label: string }[] = [
    { value: String(p.right), suffix: `/${p.questions}`, label: copy.complete.correctLabel },
    { value: mmss(p.seconds), label: copy.complete.minutesLabel },
    { value: String(p.toReview), label: copy.complete.toReviewLabel },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: theme.space.page,
          paddingTop: 24,
          paddingBottom: 12,
          gap: 18,
        }}
      >
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          <Ring
            progress={1}
            size={200 * Math.min(k, 1.2)}
            stroke={18}
            accessibilityLabel={copy.complete.ringLabel}
          >
            <CheckIcon size={80} strokeWidth={5} />
          </Ring>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <AppText
            variant="meta"
            color={theme.color.sub}
            style={{ letterSpacing: 1.2, textAlign: 'center' }}
          >
            {copy.complete.kicker(p.number, p.total).toUpperCase()}
          </AppText>
          <AppText variant="h1" accessibilityRole="header" style={{ textAlign: 'center' }}>
            {p.title}
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {stats.map((s) => (
            <View
              key={s.label}
              accessible
              accessibilityLabel={`${s.value}${s.suffix ? ` of ${s.suffix.slice(1)}` : ''} ${s.label}`}
              style={{
                flexGrow: 1,
                flexBasis: 100,
                borderWidth: theme.border.thin,
                borderColor: theme.color.line,
                borderRadius: theme.radius.card,
                padding: 14,
                gap: 2,
              }}
            >
              <AppText variant="h1" style={big}>
                {s.value}
                {s.suffix ? (
                  <AppText variant="h2" color={theme.color.sub}>
                    {s.suffix}
                  </AppText>
                ) : null}
              </AppText>
              <AppText variant="body" color={theme.color.sub}>
                {s.label}
              </AppText>
            </View>
          ))}
        </View>

        <View
          accessible
          accessibilityLabel={`${copy.complete.unitRow(p.unitTitle)}. ${copy.complete.unitProgress(p.lessonsDone, p.total)}. ${p.nextLine}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 14,
            borderWidth: theme.border.thin,
            borderColor: theme.color.line,
            borderRadius: theme.radius.card,
            padding: 14,
          }}
        >
          <Ring progress={p.total ? p.lessonsDone / p.total : 0} size={56} stroke={6}>
            <AppText
              variant="meta"
              allowFontScaling={false}
              style={{ fontFamily: theme.text.h2.fontFamily, fontSize: 13 }}
            >
              {`${p.lessonsDone}/${p.total}`}
            </AppText>
          </Ring>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="question" style={{ fontSize: theme.text.h2.fontSize }}>
              {copy.complete.unitRow(p.unitTitle)}
            </AppText>
            <AppText variant="body" color={theme.color.sub}>
              {p.nextLine}
            </AppText>
          </View>
        </View>
      </ScrollView>

      <View
        style={{ paddingHorizontal: theme.space.page, paddingBottom: 12, paddingTop: 8, gap: 10 }}
      >
        <Button label={copy.complete.continue} onPress={p.onContinue} />
        <Button label={copy.complete.stop} variant="secondary" onPress={p.onStop} />
      </View>
    </SafeAreaView>
  );
}
