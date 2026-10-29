import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CheckIcon, LockIcon } from '../components/icons';
import { Ring } from '../components/Ring';
import { copy } from '../copy';
import type { LessonNode, TestNode, UnitModel } from '../state/homeModel';
import { useGlyphScale, useTheme } from '../theme/theme';

export interface HomeViewProps {
  trackLabel: string;
  readiness: { score: number; tick?: number };
  unit: UnitModel | null;
  others: UnitModel[];
  onSettings: () => void;
  onLesson: (n: LessonNode) => void;
  onTest: (n: TestNode) => void;
  /** A locked lesson, locked test or locked unit was tapped. */
  onLocked: () => void;
  onSelectUnit: (unitId: string) => void;
}

const NODE = 52;
const CURRENT_NODE = 64;

function Num({ children, color }: { children: string | number; color?: string }) {
  const theme = useTheme();
  const k = Math.min(useGlyphScale(), 1.5);
  // Numbers inside the nodes keep a fixed size so they stay inside their circles.
  return (
    <AppText
      variant="meta"
      allowFontScaling={false}
      color={color}
      style={{ fontFamily: theme.text.h2.fontFamily, fontSize: 20 * k, lineHeight: 24 * k }}
    >
      {children}
    </AppText>
  );
}

/** S2 Home: lesson path (design/png/02-home-lesson-path.png). Presentational. */
export function HomeView(p: HomeViewProps) {
  const theme = useTheme();
  const k = Math.min(useGlyphScale(), 1.5);
  const col = (CURRENT_NODE + 4) * k;
  const ringLabel =
    p.readiness.tick === undefined
      ? copy.learn.readiness(p.readiness.score)
      : copy.learn.readinessWithMark(p.readiness.score, Math.round(p.readiness.tick * 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, paddingBottom: 28, gap: 18 }}>
        <View style={{ gap: 2 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: 12,
            }}
          >
            <AppText variant="body" color={theme.color.sub} style={{ flexShrink: 1 }}>
              {p.trackLabel}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={copy.home.settings}
              onPress={p.onSettings}
              style={{ minHeight: theme.size.minTap, justifyContent: 'center' }}
            >
              <AppText variant="body" style={{ textDecorationLine: 'underline' }}>
                {copy.home.settings}
              </AppText>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: 12,
            }}
          >
            <AppText variant="h1" accessibilityRole="header" style={{ flexShrink: 1 }}>
              {copy.learn.title}
            </AppText>
            <Ring
              progress={p.readiness.score / 100}
              size={48}
              stroke={5}
              tick={p.readiness.tick}
              accessibilityLabel={ringLabel}
            >
              <AppText
                variant="meta"
                allowFontScaling={false}
                style={{ fontFamily: theme.text.h2.fontFamily, fontSize: 14 }}
              >
                {p.readiness.score}
              </AppText>
            </Ring>
          </View>
        </View>

        {!p.unit ? (
          <AppText variant="body" color={theme.color.sub}>
            {copy.home.emptyBody}
          </AppText>
        ) : (
          <>
            <UnitCard unit={p.unit} />
            <View>
              {p.unit.nodes.map((node, i) => (
                <PathRow
                  key={node.kind === 'lesson' ? node.lessonId : `${node.variant}-${node.unitId}`}
                  node={node}
                  first={i === 0}
                  last={i === p.unit!.nodes.length - 1}
                  col={col}
                  onLesson={p.onLesson}
                  onTest={p.onTest}
                  onLocked={p.onLocked}
                />
              ))}
            </View>
          </>
        )}

        {p.others.length > 0 && (
          <View style={{ gap: 6 }}>
            <AppText variant="h2" accessibilityRole="header">
              {copy.home.otherUnits}
            </AppText>
            {p.others.map((u) => (
              <View
                key={u.unit.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderTopWidth: theme.border.thin,
                  borderColor: theme.color.line,
                  columnGap: 10,
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={copy.home.unitRow(
                    u.unit.title,
                    u.lessonsDone,
                    u.lessonsTotal,
                  )}
                  onPress={() => p.onSelectUnit(u.unit.id)}
                  style={{
                    flex: 1,
                    minHeight: theme.size.minTap + 8,
                    justifyContent: 'center',
                    paddingVertical: 8,
                  }}
                >
                  <AppText variant="body">
                    {copy.home.unitRow(u.unit.title, u.lessonsDone, u.lessonsTotal)}
                  </AppText>
                </Pressable>
                {!u.owned && <UnlockButton onPress={p.onLocked} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function UnlockButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copy.home.unlock}
      onPress={onPress}
      style={{
        minHeight: theme.size.minTap,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 6,
        paddingHorizontal: 6,
      }}
    >
      <LockIcon size={22} />
      <AppText variant="body" style={{ fontFamily: theme.text.question.fontFamily }}>
        {copy.home.unlock}
      </AppText>
    </Pressable>
  );
}

function UnitCard({ unit }: { unit: UnitModel }) {
  const theme = useTheme();
  const { cab } = theme.color;
  return (
    <View
      accessible
      accessibilityLabel={`${copy.home.unitOf(unit.number, unit.total)}. ${unit.unit.title}. ${copy.home.lessonsDone(unit.lessonsDone, unit.lessonsTotal)}. ${unit.formatLine}`}
      style={{
        backgroundColor: theme.color.ink,
        borderRadius: 20,
        padding: 20,
        gap: 8,
      }}
    >
      <AppText variant="meta" color={cab.sub} style={{ letterSpacing: 1.2 }}>
        {copy.home.unitOf(unit.number, unit.total).toUpperCase()}
      </AppText>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          columnGap: 12,
        }}
      >
        <AppText variant="h1" color={cab.ink}>
          {unit.unit.title}
        </AppText>
        <AppText variant="body" color={cab.sub}>
          {copy.home.lessonsDone(unit.lessonsDone, unit.lessonsTotal)}
        </AppText>
      </View>
      <AppText variant="body" color={cab.ink}>
        {unit.formatLine}
      </AppText>
    </View>
  );
}

function PathRow({
  node,
  first,
  last,
  col,
  onLesson,
  onTest,
  onLocked,
}: {
  node: LessonNode | TestNode;
  first: boolean;
  last: boolean;
  col: number;
  onLesson: (n: LessonNode) => void;
  onTest: (n: TestNode) => void;
  onLocked: () => void;
}) {
  const theme = useTheme();
  const k = Math.min(useGlyphScale(), 1.5);
  const isCurrent = node.kind === 'lesson' && node.status === 'current';
  const locked = node.kind === 'lesson' ? node.status === 'locked' : node.locked;
  const faded = node.kind === 'lesson' && (node.status === 'upcoming' || node.status === 'locked');

  const press = () => {
    if (locked) onLocked();
    else if (node.kind === 'lesson') onLesson(node);
    else onTest(node);
  };

  // Text for the row.
  let title: string;
  let meta: string;
  if (node.kind === 'lesson') {
    title = node.title;
    meta =
      node.status === 'done'
        ? copy.home.doneMeta(node.minutes)
        : node.status === 'tested_out'
          ? copy.home.testedOutMeta(node.minutes)
          : node.status === 'locked'
            ? copy.home.lockedMeta(node.minutes)
            : copy.home.plainMeta(node.minutes);
  } else if (node.variant === 'full_locked') {
    title = copy.home.fullCheck;
    meta = copy.home.lockedMeta(node.minutes);
  } else {
    title =
      node.testKind === 'real'
        ? copy.home.unitCheckReal(node.count)
        : copy.home.practiceTest(node.count);
    meta =
      node.variant === 'practice'
        ? `${copy.home.plainMeta(node.minutes)} · ${copy.home.free}`
        : copy.home.plainMeta(node.minutes);
  }

  const nodeSize = (isCurrent ? CURRENT_NODE : NODE) * k;
  const subColor = theme.color.sub;
  const label = `${title}. ${meta}`;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
      <View
        style={{ width: col, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* The path line behind the nodes; it starts and ends at the first and last node. */}
        <View
          style={{
            position: 'absolute',
            width: 3,
            top: first ? '50%' : 0,
            bottom: last ? '50%' : 0,
            backgroundColor: theme.color.track,
          }}
        />
        <NodeShape node={node} size={nodeSize} locked={locked} />
      </View>
      {isCurrent && node.kind === 'lesson' ? (
        <View
          style={{
            flex: 1,
            marginVertical: 8,
            borderWidth: theme.border.strong,
            borderColor: theme.color.ink,
            borderRadius: 20,
            padding: 16,
            gap: 6,
          }}
        >
          <AppText variant="meta" color={subColor} style={{ letterSpacing: 1.2 }}>
            {copy.home.upNext(node.number).toUpperCase()}
          </AppText>
          <AppText variant="h2">{node.title}</AppText>
          <AppText variant="meta" color={subColor}>
            {copy.lesson.meta(node.minutes, node.questions)}
          </AppText>
          <View style={{ height: 6 }} />
          <Button
            label={node.inProgress ? copy.learn.resumeLesson : copy.learn.startLesson}
            onPress={press}
          />
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={locked ? `${label}. ${copy.home.unlock}` : label}
          onPress={press}
          style={{
            flex: 1,
            minHeight: 72 * k,
            justifyContent: 'center',
            paddingVertical: 10,
            gap: 2,
          }}
        >
          <AppText variant="h2" color={faded ? subColor : theme.color.ink}>
            {title}
          </AppText>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 12 }}
          >
            <AppText variant="meta" color={subColor}>
              {meta}
            </AppText>
            {locked && (
              <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
                <LockIcon size={18} />
                <AppText variant="meta" style={{ fontFamily: theme.text.question.fontFamily }}>
                  {copy.home.unlock}
                </AppText>
              </View>
            )}
          </View>
        </Pressable>
      )}
    </View>
  );
}

function NodeShape({
  node,
  size,
  locked,
}: {
  node: LessonNode | TestNode;
  size: number;
  locked: boolean;
}) {
  const theme = useTheme();
  const { ink, bg, track } = theme.color;
  const base = {
    width: size,
    height: size,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: bg,
  };

  if (node.kind === 'test') {
    return (
      <View
        style={{
          ...base,
          borderRadius: 14,
          borderWidth: 3,
          borderColor: locked ? track : ink,
        }}
      >
        {locked ? <LockIcon size={24} color={theme.color.sub} /> : <Num>{node.count}</Num>}
      </View>
    );
  }
  switch (node.status) {
    case 'done':
    case 'tested_out':
      return (
        <View style={{ ...base, borderRadius: size / 2, borderWidth: 5, borderColor: ink }}>
          <CheckIcon size={24} strokeWidth={3} />
        </View>
      );
    case 'current':
      return (
        <Ring progress={node.fraction} size={size} stroke={6} dot>
          <Num>{node.number}</Num>
        </Ring>
      );
    case 'locked':
      return (
        <View style={{ ...base, borderRadius: size / 2, borderWidth: 5, borderColor: track }}>
          <LockIcon size={22} color={theme.color.sub} />
        </View>
      );
    default:
      return (
        <View style={{ ...base, borderRadius: size / 2, borderWidth: 5, borderColor: track }}>
          <Num color={theme.color.sub}>{node.number}</Num>
        </View>
      );
  }
}
