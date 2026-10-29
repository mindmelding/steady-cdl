import { StubScreen } from '../../src/screens/StubScreen';
import { copy } from '../../src/copy';

export default function Screen() {
  return <StubScreen title={copy.tabs.testDay} note={copy.stub.testDay} />;
}
