import { useLocalSearchParams } from 'expo-router';
import { RunScreen } from '../../../src/screens/RunScreen';

export default function Run() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RunScreen runId={Number.parseInt(id ?? '0', 10)} />;
}
