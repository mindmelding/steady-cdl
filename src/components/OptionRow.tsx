import { Pressable, View } from 'react-native';
import { useGlyphScale, useTheme } from '../theme/theme';
import { AppText } from './AppText';
import { CheckIcon, CrossIcon } from './icons';
import { copy } from '../copy';

/**
 * The one rule (CLAUDE.md §6): correct and incorrect are always icon + word, never colour alone.
 *  idle      1.5 pt line border, outlined letter key
 *  selected  2.5 pt black border, filled black letter key
 *  correct   2.5 pt black border, soft fill, filled black circle with white check, "Correct answer"
 *  wrong     2 pt DASHED black border, x icon replaces the key, "Your answer"
 */
export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong';

const BASE_KEY = 32;

export function OptionRow({
  letter,
  text,
  state,
  onPress,
  disabled = false,
}: {
  letter: string;
  text: string;
  state: OptionState;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const k = useGlyphScale();
  const KEY = BASE_KEY * k;
  const { ink, bg, soft, line } = theme.color;
  const strong = state === 'selected' || state === 'correct';
  const wrong = state === 'wrong';

  const borderWidth = strong
    ? theme.border.strong
    : wrong
      ? theme.sun
        ? 3
        : 2
      : theme.border.thin;
  const borderColor = strong || wrong ? ink : line;
  const word =
    state === 'correct' ? copy.question.correctAnswer : wrong ? copy.question.yourAnswer : null;
  const base = copy.question.optionLabel(letter, text);
  const label = word ? `${base}. ${word}` : base;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: state === 'selected', disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: theme.size.minTap + 16,
        borderRadius: theme.radius.option,
        borderWidth,
        borderStyle: wrong ? 'dashed' : 'solid',
        borderColor,
        backgroundColor: state === 'correct' ? soft : bg,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 14,
        rowGap: 6,
      }}
    >
      <View
        style={{
          width: KEY,
          height: KEY,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {wrong ? (
          <CrossIcon size={26} strokeWidth={3} />
        ) : state === 'correct' ? (
          <View
            style={{
              width: KEY,
              height: KEY,
              borderRadius: KEY / 2,
              backgroundColor: ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon size={20} color={bg} strokeWidth={3} />
          </View>
        ) : (
          <View
            style={{
              width: KEY,
              height: KEY,
              borderRadius: KEY / 2,
              borderWidth: theme.border.thin,
              borderColor: ink,
              backgroundColor: state === 'selected' ? ink : bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* One-letter key: kept at a fixed size so it stays inside its circle; the option text scales. */}
            <AppText
              variant="meta"
              allowFontScaling={false}
              color={state === 'selected' ? bg : ink}
              style={{
                fontFamily: theme.text.question.fontFamily,
                fontSize: 15 * k,
                lineHeight: 20 * k,
              }}
            >
              {letter}
            </AppText>
          </View>
        )}
      </View>
      <AppText variant="option" style={{ flexGrow: 1, flexShrink: 1, flexBasis: 120 }}>
        {text}
      </AppText>
      {word && (
        <AppText
          variant="body"
          color={ink}
          style={{
            fontFamily:
              state === 'correct' ? theme.text.question.fontFamily : theme.text.body.fontFamily,
            marginLeft: 'auto',
          }}
        >
          {word}
        </AppText>
      )}
    </Pressable>
  );
}
