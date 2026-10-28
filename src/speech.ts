import * as Speech from 'expo-speech';

export function speak(
  text: string,
  opts: { rate?: number; voice?: string | null; onDone?: () => void },
) {
  try {
    Speech.stop();
    Speech.speak(text, {
      rate: opts.rate ?? 1,
      voice: opts.voice ?? undefined,
      onDone: opts.onDone,
      onStopped: opts.onDone,
      onError: opts.onDone,
    });
  } catch {
    opts.onDone?.();
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    /* nothing to stop */
  }
}
