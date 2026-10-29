import { useState } from 'react';
import { Linking, Pressable, TextInput, View } from 'react-native';
import { copy } from '../copy';
import { useTheme } from '../theme/theme';
import { AppText } from './AppText';
import { Button, LinkButton } from './Button';
import { CheckIcon, ChevronIcon, CrossIcon, FlagIcon, SpeakerIcon } from './icons';
import { Sheet } from './Sheet';

export interface ProofInfo {
  letter: string;
  answerText: string;
  why: string;
  /** "State CDL manual · Section to be confirmed · 49 CFR 393.51" */
  sourceLine: string;
  /** "Last checked Oct 2026" */
  lastChecked: string;
  /** The <= 240 character paraphrase shown on the Source card. */
  paraphrase: string;
  officialUrl: string;
}

/**
 * S5 Proof sheet (design/png/05-proof-sheet.png): the tray after each practice answer.
 * Header icon + word, the answer, Why, a mono Source block (tap for the Source card), Read aloud
 * and Report a mistake. Continue lives in the screen's footer. Never rendered in unit checks.
 */
export function ProofSheet({
  correct,
  info,
  speaking,
  onReadAloud,
  onReport,
}: {
  correct: boolean;
  info?: ProofInfo;
  speaking: boolean;
  onReadAloud: () => void;
  onReport?: (reason: string, note: string) => void | Promise<void>;
}) {
  const theme = useTheme();
  const [sourceOpen, setSourceOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <View
      testID="proof-sheet"
      style={{
        marginTop: 6,
        borderRadius: theme.radius.sheet,
        borderWidth: theme.border.strong,
        borderColor: theme.color.ink,
        padding: 18,
        gap: 14,
      }}
    >
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
        }}
      >
        {correct ? (
          <CheckIcon size={32} strokeWidth={3} />
        ) : (
          <CrossIcon size={32} strokeWidth={3} />
        )}
        <AppText variant="h2">{correct ? copy.question.correct : copy.question.notQuite}</AppText>
        {!correct && (
          <AppText variant="body" color={theme.color.sub} style={{ marginLeft: 'auto' }}>
            {copy.question.addedToReview}
          </AppText>
        )}
      </View>

      {info && (
        <>
          <AppText variant="question">{copy.proof.answerIs(info.letter, info.answerText)}</AppText>
          <View style={{ gap: 4 }}>
            <AppText variant="meta" color={theme.color.sub}>
              {copy.proof.why}
            </AppText>
            <AppText variant="body">{info.why}</AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${copy.proof.sourceTitle}. ${info.sourceLine}. ${info.lastChecked}. ${copy.proof.openSource}`}
            onPress={() => setSourceOpen(true)}
            style={{
              backgroundColor: theme.color.soft,
              borderRadius: 14,
              padding: 14,
              minHeight: theme.size.minTap,
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 10,
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="question" style={{ fontSize: theme.text.body.fontSize }}>
                {copy.proof.sourceTitle}
              </AppText>
              <AppText variant="cite">{info.sourceLine}</AppText>
              <AppText variant="meta" color={theme.color.sub}>
                {info.lastChecked}
              </AppText>
            </View>
            <ChevronIcon size={22} color={theme.color.sub} />
          </Pressable>
        </>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 28 }}>
        <LinkButton
          label={speaking ? copy.question.stopReading : copy.question.readAloud}
          icon={<SpeakerIcon size={24} color={theme.color.ink} />}
          onPress={onReadAloud}
        />
        {onReport && (
          <LinkButton
            label={copy.proof.reportMistake}
            icon={<FlagIcon size={24} color={theme.color.sub} />}
            onPress={() => setReportOpen(true)}
          />
        )}
      </View>

      {info && <SourceCard visible={sourceOpen} info={info} onClose={() => setSourceOpen(false)} />}
      {onReport && (
        <ReportSheet visible={reportOpen} onClose={() => setReportOpen(false)} onSend={onReport} />
      )}
    </View>
  );
}

/** S13: the Source card. A short paraphrase plus the official link; never verbatim manual text. */
export function SourceCard({
  visible,
  info,
  onClose,
}: {
  visible: boolean;
  info: ProofInfo;
  onClose: () => void;
}) {
  const theme = useTheme();
  const hasLink = info.officialUrl.trim() !== '';
  return (
    <Sheet visible={visible} onClose={onClose} closeLabel={copy.proof.sourceCard.close}>
      <AppText variant="h2" accessibilityRole="header">
        {copy.proof.sourceCard.title}
      </AppText>
      <AppText variant="cite">{info.sourceLine}</AppText>
      <AppText variant="meta" color={theme.color.sub}>
        {info.lastChecked}
      </AppText>
      <View style={{ gap: 4 }}>
        <AppText variant="meta" color={theme.color.sub}>
          {copy.proof.sourceCard.plain}
        </AppText>
        <AppText variant="body">{info.paraphrase}</AppText>
      </View>
      {hasLink ? (
        <Button
          label={copy.proof.sourceCard.openManual}
          onPress={() => {
            void Linking.openURL(info.officialUrl).catch(() => undefined);
          }}
        />
      ) : (
        <AppText variant="body" color={theme.color.sub}>
          {copy.proof.sourceCard.noLink}
        </AppText>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.proof.sourceCard.close}
        onPress={onClose}
        style={{ minHeight: theme.size.minTap, alignItems: 'center', justifyContent: 'center' }}
      >
        <AppText variant="button">{copy.proof.sourceCard.close}</AppText>
      </Pressable>
    </Sheet>
  );
}

/** S12: Report a mistake. Six reasons, an optional note, saved in the local pending_reports queue. */
export function ReportSheet({
  visible,
  onClose,
  onSend,
}: {
  visible: boolean;
  onClose: () => void;
  onSend: (reason: string, note: string) => void | Promise<void>;
}) {
  const theme = useTheme();
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    // Reset after the sheet is gone so the next report starts clean.
    setTimeout(() => {
      setReason(null);
      setNote('');
      setSent(false);
    }, 300);
  };

  return (
    <Sheet visible={visible} onClose={close} closeLabel={copy.proof.report.cancel}>
      <AppText variant="h2" accessibilityRole="header">
        {copy.proof.report.title}
      </AppText>
      {sent ? (
        <>
          <AppText variant="body">{copy.proof.report.thanks}</AppText>
          <Button label={copy.proof.report.done} onPress={close} />
        </>
      ) : (
        <>
          <View style={{ gap: 10 }} accessibilityRole="radiogroup">
            {copy.proof.report.reasons.map((r) => {
              const on = reason === r;
              return (
                <Pressable
                  key={r}
                  accessibilityRole="radio"
                  accessibilityLabel={r}
                  accessibilityState={{ selected: on, checked: on }}
                  onPress={() => setReason(r)}
                  style={{
                    minHeight: theme.size.minTap,
                    borderRadius: theme.radius.option,
                    borderWidth: on ? theme.border.strong : theme.border.thin,
                    borderColor: on ? theme.color.ink : theme.color.line,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 10,
                  }}
                >
                  <AppText variant="option" style={{ flex: 1 }}>
                    {r}
                  </AppText>
                  {on ? <CheckIcon size={24} strokeWidth={3} /> : null}
                </Pressable>
              );
            })}
          </View>
          <View style={{ gap: 6 }}>
            <AppText variant="meta" color={theme.color.sub}>
              {copy.proof.report.noteLabel}
            </AppText>
            <TextInput
              accessibilityLabel={copy.proof.report.noteLabel}
              value={note}
              onChangeText={setNote}
              multiline
              style={{
                minHeight: 80,
                borderWidth: theme.border.thin,
                borderColor: theme.color.line,
                borderRadius: theme.radius.option,
                padding: 12,
                fontFamily: theme.text.body.fontFamily,
                fontSize: theme.text.body.fontSize,
                color: theme.color.ink,
                textAlignVertical: 'top',
              }}
            />
          </View>
          <Button
            label={copy.proof.report.send}
            disabled={reason === null}
            accessibilityHint={copy.proof.report.pickReason}
            onPress={async () => {
              if (reason === null) return;
              await onSend(reason, note.trim());
              setSent(true);
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.proof.report.cancel}
            onPress={close}
            style={{ minHeight: theme.size.minTap, alignItems: 'center', justifyContent: 'center' }}
          >
            <AppText variant="button">{copy.proof.report.cancel}</AppText>
          </Pressable>
        </>
      )}
    </Sheet>
  );
}
