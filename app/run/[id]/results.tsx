import { useLocalSearchParams } from 'expo-router';
import { ResultsScreen } from '../../../src/screens/ResultsScreen';

export default function Results() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ResultsScreen runId={Number.parseInt(id ?? '0', 10)} />;
}
