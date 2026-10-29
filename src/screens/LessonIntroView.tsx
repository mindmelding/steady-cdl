import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CloseIcon, SpeakerIcon } from '../components/icons';
import { StepBar } from '../components/StepBar';
import { copy } from '../copy';
import type { Citation } from '../db/content/types';
import { formatCitation } from '../domain/citations';
import { useGlyphScale, useTheme } from '../theme/theme';

export interface LessonIntroViewProps {
  unitTitle: string;
  number: number;
  total: number;
  title: string;
  minutes: number;
  questions: number;
  /** "On the Texas test", only when the format row is verified. */
  onStateTest?: string;
  why: string;
  keyFacts: { label: string; text: string; citation: Citation }[];
  startLabel: string;
  speaking: boolean;
  onStart: () => void;
  onClose: () => void;
  onReadAloud: () => void;
}

/** Split a "why" into plain and bold runs. `**key phrase**` marks the bold part. */
export function whyRuns(why: string): { text: string; bold: boolean }[] {
  if (why.includes('**')) {
    return why
      .split('**')
      .map((text, i) => ({ text, bold: i % 2 === 1 }))
      .filter((r) => r.text !== '');
  }
  // No markup: bold the first sentence so the key idea can be scanned.
  const m = /^(.+?[.!?])(\s+.*)?$/s.exec(why);
  if (!m || !m[2]) return [{ text: why, bold: true }];
  return [
    { text: m[1], bold: true },
    { text: m[2], bold: false },
  ];
}

/** S3 Lesson intro (design/png/03-lesson-intro.png). Presentational. */
export function LessonIntroView(p: LessonIntroViewProps) {
  const theme = useTheme();
  const k = useGlyphScale();
  const metaParts = [copy.lesson.meta(p.minutes, p.questions)];
  if (p.onStateTest) metaParts.push(p.onStateTest);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingHorizontal: theme.space.page,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.lesson.close}
          onPress={p.onClose}
          style={{
            width: theme.size.closeTap,
            height: theme.size.closeTap,
            justifyContent: 'center',
          }}
        >
          <CloseIcon size={26} strokeWidth={3} />
        </Pressable>
        <StepBar
          total={Math.max(1, p.questions)}
          current={-1}
          label={copy.lesson.meta(p.minutes, p.questions)}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: theme.space.page, paddingBottom: 16, gap: 16 }}
      >
        <AppText variant="meta" color={theme.color.sub} style={{ letterSpacing: 1.2 }}>
          {copy.lesson.kicker(p.unitTitle, p.number, p.total).toUpperCase()}
        </AppText>
        <AppText variant="h1" accessibilityRole="header">
          {p.title}
        </AppText>
        <AppText variant="body" color={theme.color.sub}>
          {metaParts.join(' · ')}
        </AppText>

        <AppText variant="option" style={{ fontSize: theme.text.option.fontSize }}>
          {whyRuns(p.why).map((r, i) => (
            <AppText
              key={i}
              variant="option"
              style={r.bold ? { fontFamily: theme.text.question.fontFamily } : undefined}
            >
              {r.text}
            </AppText>
          ))}
        </AppText>

        <View style={{ gap: 4, paddingTop: 4 }}>
          <AppText variant="h2" accessibilityRole="header">
            {copy.lesson.keyFacts}
          </AppText>
          <View style={{ borderTopWidth: theme.border.thin, borderColor: theme.color.line }}>
            {p.keyFacts.map((f, i) => (
              <View
                key={i}
                accessible
                accessibilityLabel={`${f.label}. ${f.text}. ${formatCitation(f.citation)}`}
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  columnGap: 16,
                  rowGap: 4,
                  paddingVertical: 14,
                  borderBottomWidth: theme.border.thin,
                  borderColor: theme.color.line,
                }}
              >
                <AppText variant="question" style={{ flexBasis: 130, flexGrow: 1, flexShrink: 1 }}>
                  {f.label}
                </AppText>
                <View style={{ flexBasis: 170, flexGrow: 2, flexShrink: 1, gap: 4 }}>
                  <AppText variant="option">{f.text}</AppText>
                  <AppText variant="cite" color={theme.color.sub}>
                    {formatCitation(f.citation)}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: theme.space.page,
          paddingBottom: 12,
          paddingTop: 8,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={p.speaking ? copy.question.stopReading : copy.question.readAloud}
          onPress={p.onReadAloud}
          style={{
            width: theme.size.buttonH * Math.min(k, 1.4),
            minHeight: theme.size.buttonH,
            borderRadius: theme.radius.button,
            borderWidth: theme.border.strong,
            borderColor: theme.color.ink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SpeakerIcon size={28} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Button label={p.startLabel} onPress={p.onStart} />
        </View>
      </View>
    </SafeAreaView>
  );
}
