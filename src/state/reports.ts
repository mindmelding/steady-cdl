import { clock, getUserRepo } from './runtime';

/** Reports queue on the device (pending_reports). Sending to the backend arrives with M5. */
export async function queueReport(questionId: string, reason: string, note: string): Promise<void> {
  await getUserRepo().queueReport(questionId, reason, note === '' ? null : note, clock.now());
}
