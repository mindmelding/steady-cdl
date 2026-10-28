import * as Haptics from 'expo-haptics';

/** Light tap on answer. Callers pass the settings toggle; never throws (web has no haptics). */
export async function lightTap(enabled: boolean): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* unsupported device: ignore */
  }
}
