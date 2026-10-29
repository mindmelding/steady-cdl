import { useLocalSearchParams } from 'expo-router';
import { ReplayScreen } from '../src/screens/ReplayScreen';

export default function Replay() {
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  return <ReplayScreen ids={(ids ?? '').split(',').filter(Boolean)} />;
}
