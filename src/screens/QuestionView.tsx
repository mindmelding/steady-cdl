import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Badge } from '../components/Badge';
import { Button, LinkButton } from '../components/Button';
import { CheckIcon, CloseIcon, CrossIcon, FlagIcon, SpeakerIcon } from '../components/icons';
import { OptionRow, type OptionState } from '../components/OptionRow';
import { StepBar } from '../components/StepBar';
import { copy } from '../copy';
import { useTheme } from '../theme/theme';

export interface QuestionViewProps {
  stem: string;
  options: string[];
  answerIndex: number;
  badge: string;
  stepIndex: number;
  total: number;
  pick: number | null;
  checked: boolean;
  isLast: boolean;
  flagged: boolean;
  speaking: boolean;
  onSelect: (i: number) => void;
  onCheck: () => void;
  onContinue: () => void;
  onClose: () => void;
  onReadAloud: () => void;
  onFlag: () => void;
}

/** S4 Question (design/png/04-question.png). Presentational: all state comes in as props. */
export function QuestionView(p: QuestionViewProps) {
  const theme = useTheme();
  const scroll = useRef<ScrollViewInstance>(null);
  const correct = p.checked && p.pick === p.answerIndex;

  useEffect(() => {
    // Bring the result row into view after Check, at any text size.
    if (p.checked) setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }, [p.checked]);

  const stateOf = (i: number): OptionState => {
    if (p.checked) {
      if (i === p.answerIndex) return 'correct';
      if (i === p.pick) return 'wrong';
      return 'idle';
    }
    return i === p.pick ? 'selected' : 'idle';
  };

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
          accessibilityLabel={copy.question.close}
          onPress={p.onClose}
          hitSlop={4}
          style={{
            width: theme.size.closeTap,
            height: theme.size.closeTap,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <CloseIcon size={26} strokeWidth={3} />
        </Pressable>
        <StepBar total={p.total} current={p.stepIndex} />
        <AppText variant="meta" color={theme.color.sub}>
          {copy.question.stepOf(p.stepIndex + 1, p.total)}
        </AppText>
      </View>

      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.space.page,
          paddingBottom: 16,
          gap: theme.space.gap,
        }}
      >
        <Badge label={p.badge} />
        <AppText variant="question" accessibilityRole="header">
          {p.stem}
        </AppText>
        <View style={{ gap: 10 }} accessibilityRole="radiogroup">
          {p.options.map((text, i) => (
            <OptionRow
              key={i}
              letter={String.fromCharCode(65 + i)}
              text={text}
              state={stateOf(i)}
              disabled={p.checked}
              onPress={() => p.onSelect(i)}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 28 }}>
          <LinkButton
            label={p.speaking ? copy.question.stopReading : copy.question.readAloud}
            icon={<SpeakerIcon size={24} color={theme.color.sub} />}
            onPress={p.onReadAloud}
          />
          <LinkButton
            label={p.flagged ? copy.question.flagged : copy.question.flag}
            icon={<FlagIcon size={24} color={theme.color.sub} filled={p.flagged} />}
            selected={p.flagged}
            onPress={p.onFlag}
          />
        </View>

        {p.checked && (
          <View
            accessible
            accessibilityLiveRegion="polite"
            accessibilityLabel={correct ? copy.question.correct : copy.question.notQuite}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              columnGap: 12,
              rowGap: 4,
              paddingTop: 4,
            }}
          >
            {correct ? (
              <CheckIcon size={32} strokeWidth={3} />
            ) : (
              <CrossIcon size={32} strokeWidth={3} />
            )}
            <AppText variant="h2">
              {correct ? copy.question.correct : copy.question.notQuite}
            </AppText>
            {!correct && (
              <AppText variant="body" color={theme.color.sub} style={{ marginLeft: 'auto' }}>
                {copy.question.addedToReview}
              </AppText>
            )}
          </View>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: theme.space.page, paddingBottom: 12, paddingTop: 8 }}>
        {p.checked ? (
          <Button
            label={p.isLast ? copy.question.finish : copy.question.continue}
            onPress={p.onContinue}
          />
        ) : (
          <Button
            label={copy.question.check}
            disabled={p.pick === null}
            accessibilityHint={copy.question.checkHint}
            onPress={p.onCheck}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
