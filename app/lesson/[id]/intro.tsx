import { useLocalSearchParams } from 'expo-router';
import { LessonIntroScreen } from '../../../src/screens/LessonIntroScreen';

export default function LessonIntro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonIntroScreen lessonId={id} />;
}
