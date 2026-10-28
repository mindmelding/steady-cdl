// Design tokens: exactly CLAUDE.md §5. Change them there first, then here.
export const color = {
  ink: '#000000',
  bg: '#FFFFFF',
  sub: '#5F5F5F',
  line: '#E5E5E5',
  soft: '#F4F4F4',
  disabledBg: '#EDEDED',
  disabledInk: '#9A9A9A',
  cab: { bg: '#000000', ink: '#FFFFFF', sub: '#BDBDBD', track: '#333333' }, // Cab Mode inverts
}; // No accent color. No gradients. No shadows (except the iOS sheet default).

export const font = {
  brand: 'Inter_600SemiBold', // wordmark, headings, buttons, numbers
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
  mono: 'IBMPlexMono_400Regular', // citations only
};

export type FontKey = keyof typeof font;

export interface TypeStyle {
  f: FontKey;
  size: number;
  lh?: number;
  ls?: number;
}

// pt, at default Dynamic Type; all scale with the OS setting
export const type = {
  display: { f: 'brand', size: 34, lh: 37, ls: -0.035 }, // paywall headline
  h1: { f: 'brand', size: 30, lh: 34, ls: -0.025 },
  h2: { f: 'brand', size: 22, lh: 28, ls: -0.02 },
  question: { f: 'bodyBold', size: 22, lh: 30 }, // question stem (S4)
  option: { f: 'body', size: 19, lh: 26 },
  body: { f: 'body', size: 18, lh: 25 }, // MINIMUM for any reading text
  meta: { f: 'body', size: 15, lh: 21 }, // secondary metadata only; never the only place info lives
  cite: { f: 'mono', size: 14, lh: 20 },
  tab: { f: 'brand', size: 12 }, // tab labels (system convention)
  button: { f: 'brand', size: 18 },
} satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof type;

export const space = { page: 20, gap: 14, card: 16 }; // 4-pt grid
export const radius = { button: 14, option: 14, card: 16, sheet: 24, chip: 999 };
export const size = { buttonH: 56, minTap: 48, closeTap: 44, tabH: 84 };
