import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { color, font, size, space, radius, type, type TypeStyle, type TypeVariant } from './tokens';

/**
 * Sun Mode (CLAUDE.md §5): black on white is already maximum contrast, so Sun Mode is
 * +2 type steps, borders 1.5 -> 2.5 pt, `sub` -> `ink`, ring track #E5E5E5 -> #BDBDBD.
 * Interpretation notes (the brief does not pin these down):
 *  - one "type step" = 2 pt, so +2 steps = +4 pt on every variant except `tab`
 *    (tab labels follow the system convention);
 *  - the neutral `line` border colour also moves to #BDBDBD so the thicker borders stay visible;
 *  - the strong (selected / correct) border goes 2.5 -> 3.5 pt so "selected" stays distinct from a
 *    2.5 pt idle border.
 */
export const SUN_TYPE_STEPS = 2;
export const TYPE_STEP_PT = 2;
export const SUN_TRACK = '#BDBDBD';

export interface ResolvedType {
  fontFamily: string;
  fontSize: number;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface Theme {
  sun: boolean;
  /** Extra multiplier applied on top of the OS font scale. Always 1 on device; dev-only on web. */
  devFontScale: number;
  color: typeof color & { sub: string; line: string; track: string };
  border: { thin: number; strong: number };
  space: typeof space;
  radius: typeof radius;
  size: typeof size;
  text: Record<TypeVariant, ResolvedType>;
}

export function resolveType(
  t: TypeStyle,
  sun: boolean,
  scale: number,
  variant: string,
): ResolvedType {
  const bump = sun && variant !== 'tab' ? SUN_TYPE_STEPS * TYPE_STEP_PT : 0;
  const fontSize = (t.size + bump) * scale;
  const out: ResolvedType = { fontFamily: font[t.f], fontSize };
  if (t.lh !== undefined) out.lineHeight = (t.lh + bump) * scale;
  if (t.ls !== undefined) out.letterSpacing = t.ls * fontSize;
  return out;
}

export function buildTheme(opts: { sun?: boolean; devFontScale?: number } = {}): Theme {
  const sun = opts.sun ?? false;
  const devFontScale = opts.devFontScale ?? 1;
  const text = {} as Record<TypeVariant, ResolvedType>;
  (Object.keys(type) as TypeVariant[]).forEach((k) => {
    text[k] = resolveType(type[k] as TypeStyle, sun, devFontScale, k);
  });
  return {
    sun,
    devFontScale,
    color: {
      ...color,
      sub: sun ? color.ink : color.sub,
      line: sun ? SUN_TRACK : color.line,
      track: sun ? SUN_TRACK : color.line,
    },
    border: sun ? { thin: 2.5, strong: 3.5 } : { thin: 1.5, strong: 2.5 },
    space,
    radius,
    size,
    text,
  };
}

const ThemeContext = createContext<Theme>(buildTheme());

export function ThemeProvider({
  sun,
  devFontScale,
  children,
}: {
  sun?: boolean;
  devFontScale?: number;
  children: ReactNode;
}) {
  const theme = useMemo(() => buildTheme({ sun, devFontScale }), [sun, devFontScale]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
