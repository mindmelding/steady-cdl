import { useLocalSearchParams } from 'expo-router';
import { LessonCompleteScreen } from '../../../src/screens/LessonCompleteScreen';

export default function LessonComplete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonCompleteScreen lessonId={id} />;
}
