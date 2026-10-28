import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText } from '../../../src/components/AppText';
import { Button } from '../../../src/components/Button';
import { copy } from '../../../src/copy';
import { getContentRepo, getUserRepo } from '../../../src/state/runtime';
import { useTheme } from '../../../src/theme/theme';

// Minimal placeholder: the real Lesson complete screen (S6) is M2.
export default function LessonComplete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [line, setLine] = useState('');

  useEffect(() => {
    (async () => {
      const qs = await getContentRepo().getLessonQuestions(id);
      const p = await getUserRepo().getProgress(id);
      setLine(copy.complete.score(p?.score ?? 0, qs.length));
    })();
  }, [id]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.color.bg,
        padding: theme.space.page,
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <AppText variant="h1" accessibilityRole="header">
        {copy.complete.title}
      </AppText>
      <AppText variant="body">{line}</AppText>
      <Button label={copy.complete.back} onPress={() => router.replace('/learn')} />
    </View>
  );
}
