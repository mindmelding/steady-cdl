import { IS_TEST_TRAFFIC, POSTHOG_HOST, POSTHOG_KEY } from './config';

export type EventProps = Record<string, string | number | boolean>;
export interface TrackOptions {
  /** Tag test traffic so it never pollutes production analytics (Manager PostHog rule). */
  is_test?: boolean;
}

/** Shape of the event a future PostHog wiring will send. Pure, so it is testable now. */
export function buildEvent(event: string, props: EventProps = {}, opts: TrackOptions = {}) {
  return {
    event,
    properties: { ...props, is_test: opts.is_test ?? IS_TEST_TRAFFIC },
    host: POSTHOG_HOST,
    enabled: POSTHOG_KEY !== '',
  };
}

/**
 * Analytics hook. Event names are object_verb (lesson_started, question_answered).
 * Currently a NO-OP: no SDK is installed and nothing leaves the device. A later PR wires PostHog
 * here once EXPO_PUBLIC_POSTHOG_KEY exists. Never pass personal data in props.
 */
export function track(event: string, props?: EventProps, opts?: TrackOptions): void {
  void buildEvent(event, props, opts);
}
