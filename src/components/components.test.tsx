import { render, screen } from '@testing-library/react-native';
import { Ring } from './Ring';
import { SteadyMark } from './SteadyMark';
import { ThemeProvider } from '../theme/theme';
import { allText, nodesWithProp } from '../testUtils/tree';
import { AppText } from './AppText';

describe('Ring and SteadyMark at the largest text size', () => {
  it('Ring keeps its centre label un-truncated and matches the snapshot', async () => {
    await render(
      <ThemeProvider devFontScale={3.1}>
        <Ring
          progress={0.78}
          size={120}
          stroke={12}
          tick={0.8}
          accessibilityLabel="Readiness 78 out of 100. Pass mark 80."
        >
          <AppText variant="h1">78</AppText>
        </Ring>
      </ThemeProvider>,
    );
    const tree = screen.toJSON();
    expect(nodesWithProp(tree, 'numberOfLines')).toHaveLength(0);
    expect(allText(tree)).toContain('78');
    expect(tree).toMatchSnapshot();
  });

  it('Ring at default size matches the snapshot', async () => {
    await render(<Ring progress={0.45} size={44} stroke={4} dot />);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('SteadyMark is fixed geometry: unaffected by font scale, snapshot at both', async () => {
    await render(
      <ThemeProvider devFontScale={3.1}>
        <SteadyMark size={120} />
      </ThemeProvider>,
    );
    const big = JSON.stringify(screen.toJSON());
    await render(
      <ThemeProvider devFontScale={1}>
        <SteadyMark size={120} />
      </ThemeProvider>,
    );
    expect(JSON.stringify(screen.toJSON())).toBe(big);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('Sun Mode makes the ring track #BDBDBD', async () => {
    await render(
      <ThemeProvider sun>
        <Ring progress={0.5} size={44} stroke={4} />
      </ThemeProvider>,
    );
    // react-native-svg serialises colours to ARGB ints in test output: 0xFFBDBDBD = 4290624957.
    expect(JSON.stringify(screen.toJSON())).toContain('4290624957');
  });
});
