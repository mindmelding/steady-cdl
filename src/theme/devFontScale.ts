import { Platform } from 'react-native';

/**
 * Browsers have no Dynamic Type, so for dev screenshots the web target reads `?fontScale=3`
 * and multiplies type sizes. Native builds never use this (the OS scales Text itself).
 * Enabled only in dev or when EXPO_PUBLIC_DEV_TOOLS=1.
 */
export const DEV_TOOLS_ENABLED: boolean =
  (typeof __DEV__ !== 'undefined' && __DEV__) || process.env.EXPO_PUBLIC_DEV_TOOLS === '1';

export function parseFontScale(search: string): number {
  const m = /[?&]fontScale=([0-9.]+)/.exec(search);
  const v = m ? parseFloat(m[1]) : 1;
  return Number.isFinite(v) && v >= 0.5 && v <= 4 ? v : 1;
}

export function getDevFontScale(): number {
  if (!DEV_TOOLS_ENABLED || Platform.OS !== 'web') return 1;
  const loc = (globalThis as { location?: { search?: string } }).location;
  return parseFontScale(loc?.search ?? '');
}
