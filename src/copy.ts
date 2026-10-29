// Every user-facing string lives here (CLAUDE.md §13) so scripts/lint-copy.ts can check the
// "never say" list. Keys whose name starts with `source` may mention Official / DMV / DPS / FMCSA
// (e.g. "Source: TX DPS"); no other key may.
export const copy = {
  tabs: {
    learn: 'Learn',
    review: 'Review',
    testDay: 'Test Day',
    cab: 'Cab Mode',
  },
  learn: {
    title: 'Learn',
    unitLine: (title: string, n: number) => `${title} · Unit ${n}`,
    lessonMeta: (minutes: number, questions: number) => `${minutes} min · ${questions} questions`,
    startLesson: 'Start lesson',
    resumeLesson: 'Resume lesson',
    redoLesson: 'Do it again',
    lessonDone: 'Lesson done',
    emptyTitle: 'No lessons yet',
    readiness: (n: number) => `Readiness ${n} out of 100`,
    readinessWithMark: (n: number, mark: number) => `Readiness ${n} out of 100. Pass mark ${mark}.`,
    sampleNote: 'Sample lesson for testing. Content is still in draft.',
  },
  stub: {
    review: 'Review mistakes arrive in the next milestone.',
    testDay: 'Test Day arrives in a later milestone.',
    cab: 'Cab Mode arrives in a later milestone.',
  },
  question: {
    check: 'Check',
    continue: 'Continue',
    finish: 'Finish lesson',
    readAloud: 'Read aloud',
    stopReading: 'Stop reading',
    flag: 'Flag',
    flagged: 'Flagged',
    close: 'Close lesson',
    stepOf: (i: number, n: number) => `${i} of ${n}`,
    stepLabel: (i: number, n: number) => `Question ${i} of ${n}`,
    badgeFederal: 'Federal rule · all states',
    badgeStateOnly: (state: string) => `${state} only`,
    correct: 'Correct.',
    notQuite: 'Not quite.',
    correctAnswer: 'Correct answer',
    yourAnswer: 'Your answer',
    addedToReview: 'Added to Review',
    optionLabel: (letter: string, text: string) => `Option ${letter}: ${text}`,
    answerIs: (letter: string, text: string) => `The answer is ${letter}: ${text}`,
    checkHint: 'Choose an answer first',
    notFound: 'This lesson could not be found.',
    loading: 'Loading',
  },
  complete: {
    title: 'Lesson complete',
    score: (right: number, total: number) => `${right} of ${total} correct`,
    back: 'Back to Learn',
  },
  states: { NAT: 'National', TX: 'Texas', CA: 'California', FL: 'Florida' } as Record<
    string,
    string
  >,
  dev: {
    galleryTitle: 'Dev gallery',
  },
};

export function stateName(code: string): string {
  return copy.states[code] ?? code;
}
