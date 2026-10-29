import { buildTheme } from './theme';
import { color, type } from './tokens';
import { parseFontScale } from './devFontScale';

describe('tokens', () => {
  it('match CLAUDE.md section 5', () => {
    expect(color.ink).toBe('#000000');
    expect(color.line).toBe('#E5E5E5');
    expect(color.cab.track).toBe('#333333');
    expect(type.body).toMatchObject({ size: 18, lh: 25 });
    expect(type.question).toMatchObject({ f: 'bodyBold', size: 22, lh: 30 });
    expect(type.cite.f).toBe('mono');
  });
});

describe('theme', () => {
  it('default theme uses token sizes and 1.5pt borders', () => {
    const t = buildTheme();
    expect(t.text.body.fontSize).toBe(18);
    expect(t.border.thin).toBe(1.5);
    expect(t.color.sub).toBe('#5F5F5F');
    expect(t.color.track).toBe('#E5E5E5');
  });

  it('Sun Mode is +2 type steps, 2.5pt borders, sub = ink, ring track #BDBDBD', () => {
    const t = buildTheme({ sun: true });
    expect(t.text.body.fontSize).toBe(22);
    expect(t.text.question.fontSize).toBe(26);
    expect(t.text.tab.fontSize).toBe(12);
    expect(t.border.thin).toBe(2.5);
    expect(t.color.sub).toBe('#000000');
    expect(t.color.track).toBe('#BDBDBD');
  });

  it('applies the dev font scale to sizes and line heights', () => {
    const t = buildTheme({ devFontScale: 3 });
    expect(t.text.question.fontSize).toBe(66);
    expect(t.text.question.lineHeight).toBe(90);
  });

  it('parses fontScale from the query string safely', () => {
    expect(parseFontScale('?fontScale=3')).toBe(3);
    expect(parseFontScale('?x=1&fontScale=2.5')).toBe(2.5);
    expect(parseFontScale('?fontScale=99')).toBe(1);
    expect(parseFontScale('')).toBe(1);
  });
});
