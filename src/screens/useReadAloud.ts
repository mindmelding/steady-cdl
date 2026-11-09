import { useCallback, useEffect, useState } from 'react';
import { speak, stopSpeaking } from '../speech';
import { useSettingsStore } from '../state/settingsStore';

/** Read aloud with the saved voice and speed; stops when the screen goes away. */
export function useReadAloud() {
  const settings = useSettingsStore((s) => s.settings);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  const stop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);
  const toggle = useCallback(
    (text: string) => {
      if (speaking) return stop();
      setSpeaking(true);
      speak(text, {
        rate: settings.speed,
        voice: settings.voice,
        onDone: () => setSpeaking(false),
      });
    },
    [speaking, stop, settings.speed, settings.voice],
  );
  return { speaking, toggle, stop };
}
