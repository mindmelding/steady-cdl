import { useLocalSearchParams } from 'expo-router';
import { QuestionScreen } from '../../../src/screens/QuestionScreen';

export default function LessonStep() {
  const { id, step } = useLocalSearchParams<{ id: string; step: string }>();
  return <QuestionScreen lessonId={id} step={Number.parseInt(step ?? '0', 10) || 0} />;
}
