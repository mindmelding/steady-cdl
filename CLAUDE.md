# CLAUDE.md: Steady CDL (build brief v1.1)

> Paste this file as `CLAUDE.md` at the repo root, or as the first prompt to Claude Code.
> **Derived from:** `docs/research/cdl-build-spec-v2-2026-10-28.md` (spec v2) + the v2 lessons-style design (`design/`). Read `HANDOFF.md` next.
> **Owner/reviewer:** Sean. **Written:** Wed Oct 28, 2026 (PT). **v1.1:** all open decisions approved by Sean on Oct 28, 2026 (§12).
> **Markers:** [VERIFY] = confirm from the primary source before shipping. [E] = estimate. [DECIDED n] = approved decision in §12. [CHANGED] = differs from spec v2 on purpose. Anything not covered here: ask Sean, don't guess.

---

## 0. What you are building (read first)

**Steady CDL** is a calm, cited, lessons-style CDL knowledge-test prep app for iOS and Android.
- **Permit (CLP):** General Knowledge (GK), Air Brakes, Combination. Texas adds **TX Commercial Rules**, taken first.
- **Endorsements:** HazMat, Tanker, Doubles/Triples, Passenger, School Bus.
- **States at MVP:** Texas, California, Florida + a national fallback (NAT). The schema defines all 51 jurisdictions now; only NAT/TX/CA/FL rows are populated.
- **Positioning:** "The CDL test prep that matches your state's real test, fixed in public when the rules change. Pay once. No ads, no auto-renew."

**Three proof points every screen must support:**
1. **Your state's real format**: count, pass mark, choices, order, each with a source.
2. **Every answer shows its source**: manual section, CFR reference, "Last checked", public fix log.
3. **Honest pricing**: one-time purchases only, the first lesson of every unit plus one practice test per section free, Restore that works, no trial, never a mid-lesson or mid-test paywall.

**Design principles (check every PR against them):**
1. **Never interrupt.** No mid-lesson/mid-test paywalls, prompts, rating asks or sounds.
2. **Show the proof.** The source is one tap away on every answer.
3. **Never lose anything.** Autosave every answer; resume exactly where the user left off.
4. **Readable anywhere.** Large type, Dynamic Type to accessibility sizes, no truncation, one-handed.
5. **Plain English.** About 8th-grade reading level or lower; terms defined inline.

**Design reference (the source of truth for look and layout):**
`design/png/01…10-*.png` (393×852 pt @2x) and `design/png/contact-sheet-v2.png`; brand files in `design/final/` (lockups, app icons, `steady-cdl-brand-guide.pdf`). If you can't see these files, ask Sean. Match their structure, spacing and type sizes. Never copy the "Sample content · mock" badge.

---

## 1. Hard rules: DO NOT

- **No ads** of any kind, no ads SDK, no attribution or tracking SDK. Privacy label: "Data Not Used to Track."
- **No subscriptions, no auto-renew, no free trial**, no countdown timers, no "limited offer", no pre-checked bundles.
- **No mascots**, characters, confetti, laurels, "PASSED" stamps, XP, gems, hearts/lives, leaderboards.
- **No streak pressure.** No streak counters, flames, "don't break your streak" copy, guilt notifications, or loss-framed reminders. A gentle optional daily-minutes goal is allowed; missing it shows nothing negative.
- **No pass guarantee or pass-rate claim.** Never write "pass first try", "guaranteed", "real test questions", "actual test", a pass percentage, "Official", or "DMV"/"DPS"/"FMCSA" in the name. Readiness copy always says "a study guide, not a guarantee."
- **No color-only meaning.** Correct/incorrect is **always icon + word** (see §6).
- **No accounts**, no live AI chat, no community forum.
- **No competitor content:** never use competitor question banks, leaked or "actual" test questions, or scrape competitors. 49 CFR is public domain; state manuals and the AAMVA model manual are paraphrased with citations only (no 12+ word verbatim runs).
- **No hazmat placard colors as decoration** (placards appear only inside questions that teach them).
- **No paid services, outreach, or public posts** on Sean's behalf. No purchases (e.g. a paid examiner review, a Spanish reviewer) without Sean's explicit OK.
- Don't add scope a gate hasn't unlocked (§10).

---

## 2. Stack

| Concern | Choice |
|---|---|
| App | **Expo (React Native, TypeScript, strict)**, Expo Router |
| Data | `expo-sqlite`: read-only **content DB** + **user DB**; Zustand persisted to SQLite |
| Purchases | **RevenueCat** (free tier), non-consumables only |
| Graphics | `react-native-svg` (ring, mark, icons) |
| Audio | `expo-speech` (Cab Mode, Read aloud); `expo-av`/background audio only in v1.0.1 [VERIFY] |
| Fonts | `expo-font`: Atkinson Hyperlegible (400/700), Inter (600; 400 for numerals if needed), IBM Plex Mono (400) |
| OTA content | EAS Update |
| Analytics / crashes | PostHog (anonymous, no IDFA) / Sentry |
| Reports backend | Cloudflare Worker + D1 (mistake reports, fix log JSON) |
| Web (post-launch) | Astro on Cloudflare Pages (SEO seed pages, `/fixes`) |
| Rule-change watch | Scheduled GitHub Action or Cloudflare Cron (free tier) (days 22–35) |
| CI / tests | EAS Build, Jest (+ snapshot tests at largest Dynamic Type), one Maestro suite |

### 2.1 One-time IAP products (7 SKUs)

| Product ID | Price | Unlocks |
|---|---|---|
| `permit_pack` | $14.99 | GK, Air Brakes, Combination (+ TX Commercial Rules for TX): all lessons, full bank, unit checks, simulator, Review, readiness. **Valid in every state** (NAT + all jurisdictions as they are added) [DECIDED 1] |
| `endo_hazmat` | $4.99 | HazMat unit |
| `endo_tanker` | $4.99 | Tanker unit |
| `endo_doubles` | $4.99 | Doubles/Triples unit |
| `endo_passenger` | $4.99 | Passenger unit |
| `endo_schoolbus` | $4.99 | School Bus unit |
| `endo_all` | $19.99 | All 5 endorsements, including modes added later |

- "Everything" = `permit_pack` + `endo_all` = **$34.98**, shown as math, not a separate SKU. If it's ever a single SKU, use the nearest store price point ($34.99) [VERIFY].
- Entitlements are **state-agnostic**: changing state never re-locks or re-sells anything [DECIDED 1].
- RevenueCat entitlements: `permit`, `hazmat`, `tanker`, `doubles`, `passenger`, `schoolbus` (`endo_all` grants all five).
- Check entitlements at launch and on foreground; cache for offline use; refunds re-lock quietly.
- **Restore** is always visible on the paywall and in Settings; needs no account.
- iOS Family Sharing on for non-consumables. Don't promise it on Android [VERIFY]. Play purchases acknowledged within 3 days.
- Show **live store prices** (never hard-coded strings in the UI).

---

## 3. Information architecture

### 3.1 Tabs (bottom bar, 4)
`Learn` (ring icon) · `Review · N` (× icon + due count) · `Test Day` (calendar icon) · `Cab Mode` (speaker icon).
Settings opens from the Learn header. Every tab label is icon + word.

### 3.2 Content hierarchy
```
Track (state + goal)                e.g. Texas · Class A permit
 └─ Unit  (= a Section)             e.g. Air Brakes, "Unit 2 of 4"; shows lessons done / total and the real test format
     ├─ Lesson (= a topic)          e.g. "Low air warnings" · 4 min · 5 questions
     │    ├─ Intro step             why it matters (1–2 sentences) + Key facts table with citations
     │    ├─ Question steps         3–6 questions, one per screen, Proof sheet after each answer
     │    └─ Lesson complete        score, minutes, items added to Review, next lesson
     └─ Unit check                  full-length, in the state's verified format (e.g. "25 Q, like the real test"); no feedback until the end
```
- **Unit order follows StateFormat.order** (TX: Commercial Rules → GK → Air Brakes → Combination). Endorsement-goal users see only their endorsement units, HazMat first.
- The **Simulator** (full test in the state format, spec v2 §5.6) is reached from the Unit check node and from Test Day.

### 3.3 Question types (MVP)
| Type | Where | Notes |
|---|---|---|
| `mc` | Lessons, unit checks, simulator | 3 or 4 options per `StateFormat.options_per_q` for that state/section; full-width rows that wrap; ≥ 48 pt targets |
| `mc_figure` | Lessons, unit checks | MC with a required `figure_asset` (gauge, placard, air-brake diagram). Original art only |
| `concept` | Lesson intro / between questions | Not scored. One idea per screen: bold key phrase + citation. Max 1 per lesson besides the intro |

No typed answers, drag-and-drop, matching, timers or speed rounds at MVP.

### 3.4 Screens (each matches a v2 mock)
| # | Screen | Mock |
|---|---|---|
| S1 | Onboarding / placement (≤ 3 screens) | `01-onboarding-placement.png` |
| S2 | Home: lesson path | `02-home-lesson-path.png` |
| S3 | Lesson intro | `03-lesson-intro.png` |
| S4 | Question | `04-question.png` |
| S5 | Proof sheet (bottom tray) | `05-proof-sheet.png` |
| S6 | Lesson complete | `06-lesson-complete.png` |
| S7 | Review mistakes | `07-review-mistakes.png` |
| S8 | Readiness / Test Day | `08-readiness-test-day.png` |
| S9 | Paywall | `09-paywall.png` |
| S10 | Cab Mode | `10-cab-mode.png` |
| S11 | Settings (text size, Sun Mode, voice and speed, Restore, "What's new and fixed", privacy, support) | none (use the same tokens) |
| S12 | Report a mistake (sheet) | none (reasons list, as spec v2 §5.14) |
| S13 | Source card (sheet from the source chip) | none |
| S14 | Unit check / Simulator + Results | none (Results leads with "Replay N mistakes") |

---

## 4. Data model

### 4.1 Content DB (read-only, shipped + OTA)
```ts
type Jurisdiction = 'NAT'|'AL'|'AK'|'AZ'|'AR'|'CA'|'CO'|'CT'|'DE'|'DC'|'FL'|'GA'|'HI'|'ID'|'IL'|'IN'|'IA'|'KS'|'KY'|'LA'|'ME'|'MD'|'MA'|'MI'|'MN'|'MS'|'MO'|'MT'|'NE'|'NV'|'NH'|'NJ'|'NM'|'NY'|'NC'|'ND'|'OH'|'OK'|'OR'|'PA'|'RI'|'SC'|'SD'|'TN'|'TX'|'UT'|'VT'|'VA'|'WA'|'WV'|'WI'|'WY';
// All 51 + NAT defined now; only NAT/TX/CA/FL populated at MVP.
type Section = 'GK'|'AIR_BRAKES'|'COMBINATION'|'TX_COMMERCIAL_RULES'|'HAZMAT'|'TANKER'|'DOUBLES_TRIPLES'|'PASSENGER'|'SCHOOL_BUS'
  | 'HAZMAT_RENEWAL'|'AIR_BRAKE_RESTRICTION';   // last two reserved for Gate 1

interface Citation {
  doc: string;            // "TX CDL Handbook" | "49 CFR"
  locator: string;        // "§5.4.2" | "393.51"
  edition?: string;       // manual edition/date
  url?: string;           // official free source
}

interface Question {
  id: string;                       // stable, e.g. "AB-LOWAIR-003"
  type: 'mc'|'mc_figure';
  state: Jurisdiction;              // 'NAT' unless state-specific
  section: Section; unit_id: string; lesson_id?: string; topic: string;
  question: string;                 // plain English, ≤ 8th grade
  options: string[];                // length must equal StateFormat.options_per_q when drawn for a simulator
  answer_index: number;
  explanation: string;              // "Why": 1–3 sentences
  manual_citation: Citation;        // required
  regulation_ref?: string;          // "49 CFR 393.51"
  cfr_sections: string[];           // machine-readable, e.g. ["49/393/51"]; the rule-change watch keys on these
  source_a: Citation; source_b: Citation;     // two-source verification
  source_excerpt_paraphrase: string;          // ≤ 240 chars, never verbatim (CI)
  official_manual_url: string;
  figure_asset?: string;            // required if text mentions "shown/figure/diagram"
  reading_grade: number;            // computed in CI
  last_checked: string;             // ISO date; shown as "Last checked Oct 2026"
  verified_a_by: string; verified_b_by: string;
  review_status: 'draft'|'agent_verified'|'human_verified'|'published'|'flagged'|'retired';
  difficulty: 1|2|3; glossary_terms: string[]; free_tier: boolean;
  version: number; change_note?: string;
}

interface Unit {                    // one per (track, section)
  id: string; section: Section; state: Jurisdiction; title: string;   // "Air Brakes"
  order: number;                    // from StateFormat.order
  lesson_ids: string[]; unit_check_count: number;   // = StateFormat.question_count
  entitlement: 'free'|'permit'|'hazmat'|'tanker'|'doubles'|'passenger'|'schoolbus';
}

interface Lesson {
  id: string; unit_id: string; order: number; title: string;   // "Low air warnings"
  minutes: number;                  // estimate shown on the path, e.g. 4
  why: string;                      // 1–2 sentences
  key_facts: { label: string; text: string; citation: Citation }[];   // 2–4 rows ("Warning comes on" / "Before tank pressure drops below 60 psi" / 49 CFR 393.51)
  step_ids: string[];               // ordered: concept + question ids (3–6 questions)
  free: boolean;                    // true only for order === 1 in each unit [DECIDED 3]
}

interface StateFormat {             // the exact-format engine; one row per jurisdiction × section
  state: Jurisdiction; section: Section; required_for: ('A'|'B'|'C'|'ENDO')[];
  order: number;                    // TX Commercial Rules = 1
  question_count: number; pass_pct: number;   // pass_pct drives the readiness tick
  options_per_q: 3|4; time_limit_min?: number;   // only if published
  test_language: 'en_only'|'en_plus'; languages?: string[];   // FL/TX = en_only (2026)
  manual_edition: string; manual_model: 'legacy'|'aamva_modernized'|'unknown';
  source_url: string; last_checked: string; verified_by: string; notes?: string;
}

interface GlossaryTerm { term: string; plain: string; es_gloss?: string; citation?: Citation; }
interface FixLogEntry { date: string; question_id?: string; state?: Jurisdiction; version: number;
  kind: 'user_report'|'rule_change'|'manual_edition'|'format_change'; summary: string; source_url?: string; }
interface WatchedSource { id: string; kind: 'ecfr_part'|'fed_register_query'|'manual_url'|'dmv_page';
  target: string; last_hash: string; last_seen: string; }
```

**Format facts to load and [VERIFY] on Day 1–2 (never ship an unverified simulator row):**
- TX: Commercial Rules 20 Q / 80%, taken first; one third-party site says 25, so resolve against TX DPS. English-only knowledge tests since Jun 1, 2026.
- FL: English-only since Feb 6, 2026.
- CA: GK 50 Q, 10 misses allowed.
- National defaults: GK 50 · Air Brakes 25 · Combination 20 · HazMat 30 · Tanker/Doubles/Passenger/School Bus 20 each · 80%.
- NY/IA: 3 answer choices (Gate 1 rows).
- Sample fact used in mocks: the low-air warning must come on before service tank pressure drops below 60 psi (or half the governor cut-out pressure, if lower), per 49 CFR 393.51. Section numbers like "§5.x" in mocks are **placeholders**.

### 4.2 User DB
`attempts(question_id, correct, chosen_index, ts, mode)`, `lesson_progress(lesson_id, step_index, done, score, seconds)`, `review_queue(question_id, box, due_date, streak_correct)`, `sims(id, unit_id, score, passed, ts)`, `entitlements(cache)`, `pending_reports`, `test_date`, `settings(text_size, sun_mode, haptics, voice, speed, daily_minutes_goal?)`.

### 4.3 Review scheduling [CHANGED] [DECIDED 5]
Spec v2 used 5 Leitner boxes (1/2/4/7/14 days). The v2 design uses a simpler, honest rule: **a missed question comes back after 1 day, then 2, then 4; it leaves Review after it's answered right twice in a row.** A miss anywhere resets it to the 1-day box.
- Box 1 → due +1 day; box 2 → +2 days; box 3 → +4 days. Correct moves up a box and increments `streak_correct`; when `streak_correct == 2`, remove it. Wrong → box 1, `streak_correct = 0`.
- "Due today" = `due_date <= today` (device local date). Show the copy line: "Each one comes back at 1, 2, then 4 days until you get it right twice."
- Misses from lessons, unit checks and simulators all enter the queue automatically.

### 4.4 Readiness (unchanged formula)
`readiness = 0.5×mastered + 0.3×avg(last 3 unit checks/sims) + 0.2×seen` per unit (0–100); overall = weighted by StateFormat.question_count. "Likely ready" at ≥ 85; below that "Almost there" / "Getting started". Never claim a pass rate.

---

## 5. Design tokens

```ts
export const color = {
  ink: '#000000', bg: '#FFFFFF', sub: '#5F5F5F', line: '#E5E5E5', soft: '#F4F4F4',
  disabledBg: '#EDEDED', disabledInk: '#9A9A9A',
  cab: { bg: '#000000', ink: '#FFFFFF', sub: '#BDBDBD', track: '#333333' },   // Cab Mode inverts
};  // No accent color. No gradients. No shadows (except the iOS sheet default).

export const font = {
  brand: 'Inter_600SemiBold',            // wordmark, headings, buttons, numbers
  body: 'AtkinsonHyperlegible_400Regular', bodyBold: 'AtkinsonHyperlegible_700Bold',
  mono: 'IBMPlexMono_400Regular',        // citations only
};
export const type = {                    // pt, at default Dynamic Type; all scale with the OS setting
  display: { f: 'brand', size: 34, lh: 37, ls: -0.035 },  // paywall headline
  h1: { f: 'brand', size: 30, lh: 34, ls: -0.025 },
  h2: { f: 'brand', size: 22, lh: 28, ls: -0.02 },
  question: { f: 'bodyBold', size: 22, lh: 30 },          // question stem (S4)
  option: { f: 'body', size: 19, lh: 26 },
  body: { f: 'body', size: 18, lh: 25 },                  // MINIMUM for any reading text
  meta: { f: 'body', size: 15, lh: 21 },                  // secondary metadata only (minutes, counts); never the only place info lives
  cite: { f: 'mono', size: 14, lh: 20 },
  tab: { f: 'brand', size: 12 },                          // tab labels (system convention)
  button: { f: 'brand', size: 18 },
};
export const space = { page: 20, gap: 14, card: 16 };     // 4-pt grid
export const radius = { button: 14, option: 14, card: 16, sheet: 24, chip: 999 };
export const size = { buttonH: 56, minTap: 48, closeTap: 44, tabH: 84 };
```
- **Sun Mode:** black on white is already maximum contrast, so Sun Mode = +2 type steps, borders 1.5 → 2.5 pt, `sub` → `ink`, and the ring track `#E5E5E5` → `#BDBDBD`.
- **Dark mode (P2):** follow the system using the Cab Mode palette.
- **Haptics:** light tap on answer; toggle in Settings. No sounds, ever.

### 5.1 Ring component (`<Ring/>`), the product motif
Used for path nodes, unit progress, readiness, lesson complete, and the Learn tab icon.
```ts
<Ring progress={0.78} size={120} stroke={12} tick={0.80} dot={false} track={color.line} color={color.ink}>
  <Text>78</Text>
</Ring>
```
- `react-native-svg`. Starts at **12 o'clock, runs clockwise**, `strokeLinecap="round"`. Track is a full circle in `track`.
- `progress` 0–1. 0 = track only. 1 = full ring (done nodes may show a filled black disk with a white ✓ instead).
- `tick` (0–1, optional): a 2.5 pt ink line crossing the ring at that angle = **the pass mark** (`StateFormat.pass_pct / 100`, usually 0.80). Never hard-code 80.
- `dot` (bool): a solid dot just past the arc end (the brand cue). Only on the current path node and the Learn tab icon.
- Sizes used: tab 22/3, path node 44/4, unit card 40/5, header 48/5, readiness 120/12, lesson complete 200/18.
- Accessibility label: e.g. "Readiness 78 out of 100. Pass mark 80."

### 5.2 Brand mark (`<SteadyMark/>`) and app icon
Fixed geometry, **not** a progress value: an 80% ring (72° gap from 12 o'clock to about 2:24), round caps, and one dot in the gap near the arc's end.
- All in fractions of the outer diameter **D** (clock angles: 0° = 12 o'clock, clockwise):
  - Large (> 64 px): R = 0.4268 D (ring centerline radius), stroke = 0.1465 D, dot radius = 0.0732 D, dot-to-cap space = 0.0318 D.
  - Small (≤ 64 px): R = 0.3962 D, stroke = 0.2075 D, dot radius = 0.1038 D, space = 0.0566 D.
  - Arc runs from (72° + cap) to (360° − cap), where cap = deg((stroke/2)/R). Dot center angle = 72° − deg((stroke/2 + space + dotR)/R).
- App icon: mark at 61% of the square, centered, black on white, square corners (the OS masks them). Use `design/final/app-icon-*.png` / `.svg`.
- Wordmark: "Steady CDL" in Inter SemiBold, outlined in `design/final/*.svg`. Don't re-typeset it in code; use the SVG.

---

## 6. The one rule: correct and incorrect are always icon + word

| State | Visual | Required words |
|---|---|---|
| Selected (before Check) | 2.5 pt black border, letter key filled black | — |
| Correct answer | 2.5 pt black border, `soft` fill, key becomes a filled black circle with a white ✓ | "Correct answer" (right side) |
| User's wrong pick | 2 pt **dashed** black border, × icon replaces the key | "Your answer" |
| Proof sheet header | ✓ or × icon | "Correct." / "Not quite." |
| Review item | × icon | the due label ("Due today", "In 2 days") |

Never rely on color, weight or border alone. VoiceOver reads the word.

---

## 7. Acceptance criteria per screen

**S1 Onboarding / placement**
- ≤ 3 screens, no account: (1) searchable state list with TX/CA/FL pinned and "Not sure — use national"; (2) goal: "Getting my permit (CLP)", "Adding an endorsement", "Renewing HazMat" as option cards with one-line descriptions; (3) "What's free" card → Home.
- A state chip ("Texas · tests in English") reflects StateFormat.test_language.
- **Ships at launch** [DECIDED 4]: "Already studied? Take a 2-minute check" placement: ≤ 10 questions drawn across the chosen units; a lesson is "tested out" when all its sampled questions are right (it stays replayable and its misses go to Review). Skippable; never blocks; never shows the paywall (tested-out locked lessons stay locked until bought).
- Segmented progress bar + "2 of 3"; back works; the **Maestro no-loop test** passes on 4 screen sizes (iPhone SE, Pro Max, small and large Android). `state_picker_repeat > 2` in < 1% of installs.

**S2 Home: lesson path**
- Header: track ("Texas · Class A permit"), "Learn", and the overall readiness ring with the pass tick.
- A black unit card: "Unit 2 of 4", unit title, "2 of 6 lessons", and the real format line (from StateFormat, e.g. "Texas test: 25 questions · 80% to pass").
- A vertical path: done nodes (filled ✓), the current node (ring + dot) expanded into an "Up next" card with minutes, question count and a "Start lesson" button, upcoming numbered nodes, and a final square **Unit check** node ("25 Q, like the real test").
- Locked units show a lock icon + "Unlock" (never a blur or a teaser countdown). One tap opens S9 only from a locked item.
- Endorsement-goal users: HazMat (or their endorsement) is the first unit; no Permit cards.

**S3 Lesson intro**
- "AIR BRAKES · LESSON 3 OF 6", title, "4 min · 5 questions · On the Texas test" (only if StateFormat includes it).
- The why in ≤ 2 sentences with the key phrase in bold; Key facts table (2–4 rows), each row with a mono citation.
- Read aloud button + "Start lesson". Closing mid-lesson keeps progress.

**S4 Question**
- Close ×, segmented step bar, "3 of 5". A state/federal badge ("Federal rule · all states" or "Texas only").
- The stem in `question` type; 3–4 full-width options with letter keys; no truncation at the largest Dynamic Type (snapshot test).
- "Check" is disabled until a choice is made. Read aloud + Flag below the options.
- Autosave on every answer; killing the app resumes on the same step.

**S5 Proof sheet (practice and lessons only; never in unit checks or simulators)**
- A bottom tray: header "✓ Correct." or "× Not quite."; if wrong, "Added to Review" on the right.
- "The answer is B · 60 psi" in bold; "Why" in 1–3 plain sentences; a Source block (mono): manual locator · CFR ref, then "Last checked Mon YYYY".
- Tapping the source opens S13: a ≤ 240-char paraphrase + the official manual link.
- Read aloud, "Report a mistake" (S12), Continue. **100% of published questions** have a citation + last_checked (CI fails otherwise).

**S6 Lesson complete**
- A large ring with ✓, "LESSON 3 OF 6 COMPLETE", the lesson title.
- 3 stat cards: "4/5 correct", "3:40 minutes", "1 to review". A unit progress row with the next lesson and its minutes.
- "Continue" + "Stop for today" (equal dignity; no guilt copy). No confetti, XP or streak.

**S7 Review mistakes**
- A card: "6 to fix", "3 due today · about 4 min", a ring "3/6", primary "Replay 6 mistakes".
- The interval line (§4.3). A list: unit label, the question's short title, × icon, due label ("Due today" bold; later dates in `sub`).
- The tab badge "Review · N" = total in queue. An empty state: "Nothing to fix. Mistakes you make will show up here."

**S8 Readiness / Test Day**
- Optional test date chip ("Nov 18 · 21 days"); the readiness ring (120 pt) with the pass tick; a status line ("Almost there"); "The tick is the 80% pass mark. Air Brakes is holding you back." (pass % from StateFormat).
- Per-section bars in **StateFormat.order**, each with a score and a pass tick.
- "Today's plan · 15 min" (Review due + the next lesson).
- **Exam-day card:** the state's tests in order with count and pass %, the language rule, and "Source: TX DPS · checked Oct 2026". "What to bring" only once sourced [VERIFY].
- Readiness detail and test date may ship in v1.0.1 per the lean plan; the readiness ring on Home ships at MVP.

**S9 Paywall**
- **Free tier** [DECIDED 3]: the **first lesson of every unit** + **one practice test per section**, each with full Proof sheets, citations and audio. Review of free-tier misses is free. Everything else in a unit (lessons 2+, unit check, full simulator) is locked until bought.
- Opens only (a) at a unit boundary **after that unit's free lesson or free practice test is completed**, or (b) on tap of a locked item. **Never** mid-lesson, mid-test, mid-Review or in Cab Mode. Guardrail `paywall_viewed{mid_test:true}` = **0** (CI/analytics alert).
- Context line ("You finished the free Air Brakes lesson."), a close × (≥ 44 pt, visible immediately), the Steady CDL lockup, "Pay once. Yours to keep.", and "✓ No ads ✓ No auto-renew ✓ No trial".
- Product cards with live prices and what each unlocks; "Everything: $34.98 once. Your free lesson and practice test in every unit stay free."; bundle math when owned ("All Endorsements $19.99 (you own 1)").
- Endorsement-goal users see endorsements first, never the Permit Pack first. No pre-selected bundle beyond the goal's natural product.
- The primary button names the product and price; "Restore purchases" is under it; "Family Sharing on iPhone" (iOS only).
- Purchase returns the user to the exact place; Restore works on a fresh install and a 2nd device.

**S10 Cab Mode**
- Inverted palette (white on black), "Cab Mode · Air Brakes", speed (0.75–1.5×).
- The safety line at start, on screen and spoken: "Listen only. Don't use the screen while driving."
- Big question text, options as A–D lines; a progress bar "7 / 25"; **two** big buttons (≥ 128 pt tall): Pause, Next.
- Audio sequence: question → pause → options → pause → answer → why. Works offline (`expo-speech`). Foreground at MVP; lock-screen/background in v1.0.1 [VERIFY].
- No paywall, prompts or rating asks. Locked units are simply not listed.

**S11–S14**
- Settings: all toggles work; "What's new and fixed" renders the fix log; Restore present.
- Report a mistake: reasons (Wrong answer / Outdated / Not in my state's manual / Confusing wording / Typo / Other), optional note, auto question ID, an offline queue; reaches D1 within 1 minute online; confirmation "Thanks — we check every report. Fixes appear in What's new."; 3+ reports auto-hide a question.
- Unit check / Simulator: the verified StateFormat (count, pass %, options, time limit only if published); no feedback until the end; Results lead with **"Replay N mistakes"**, the filter defaults to Missed, then score, pass/fail and topics.

**Global**
- VoiceOver/TalkBack labels on S2–S10 (manual audit). Snapshot tests at the largest accessibility size on S2, S4, S5, S7, S9.
- Rating prompt: native API, at most once, only on Home after the 2nd passed unit check/simulator.
- An analytics event set as spec v2 §10, plus `lesson_started/completed{lesson_id}`, `placement_completed{tested_out_n}`, `review_due_viewed{n}`.

---

## 8. Content pipeline (unchanged from spec v2 §7, summarized)
1. Topic map per section → lessons (3–6 Q each).
2. Agent draft → agent Check 1 (fresh context, `source_b`) → **human Check 2** (100% of HazMat and TX Commercial Rules, every flagged item, 20% sample of the rest; a batch goes back if the sample error > 2%).
3. **CI lint:** exactly one correct answer; no unintended "all/none of the above"; similar option lengths; citation + both sources; `last_checked` ≤ 12 months; no 12+ word verbatim match; near-duplicate > 0.92 fails; reading grade ≤ 8; LanguageTool pass; paraphrase ≤ 240 chars; figure check; section integrity; state scoping; no repeats within a draw; known-trap regressions (e.g. HazMat basic description order); every published question has `cfr_sections` or a mapped manual citation; `options.length` matches `options_per_q` for simulator draws; every lesson has 2–4 key facts with citations.
4. Lean launch targets [E]: GK 250 · Air Brakes 100 · Combination 80 · TX CR 60 · HazMat 160 · Tanker/Doubles/Passenger/School Bus 50 each (~850 total). Glossary: 80 terms.
5. Fixes bump `version`, write a FixLogEntry, ship via EAS Update.

---

## 9. Lean MVP milestones (~15 working days [E])

| Days | Claude Code | Sean | Done when |
|---|---|---|---|
| 1–3 | Scaffold (Expo Router, TS strict), SQLite schemas (§4, all 51 jurisdictions), tokens + fonts, `<Ring/>`, `<SteadyMark/>`, the question screen + autosave, CI lint | Apple/Play accounts, Paid Apps, Small Business Program; verify StateFormat TX/CA/FL/NAT; manuals + editions | **M1:** runs on iPhone + Android; content DB loads; snapshot at the largest type passes |
| 4–6 | Lesson path (S2), intro (S3), question (S4), Proof sheet (S5), lesson complete (S6), Review (S7, §4.3), unit check + Results, readiness, onboarding (S1) + 2-minute placement check + no-loop Maestro | Create 7 IAPs + sandbox tester; review the GK/HazMat batch 1 | **M2:** the full lesson loop offline on 100 sample Qs |
| 7–9 | Content wave 1 (GK, Air Brakes, Combination, TX CR, HazMat at ~70%); RevenueCat + paywall (S9) | HazMat + TX CR 100% review; samples | **M3:** wave 1 lint-clean |
| 10 | Restore, refunds, entitlement cache, SDK audit | 2nd-device restore | **M4:** 7 products sandbox-tested; 0 mid-test paywall views |
| 11 | Report a mistake (Worker + D1), fix log, Source card, Cab Mode (S10), Sun Mode, VoiceOver/TalkBack, glossary (80) | Cab Mode ride test (passenger seat) | **M5:** trust + accessibility done |
| 12 | Endorsement units to 50 Q each; TX/CA/FL overrides; dedupe + verbatim | Usability check with 3–5 people Sean knows (no public recruiting posts) | **M6:** all units at lean targets; sample error ≤ 2% |
| 13 | Store assets: screenshots 1–3 (`design/store/`) + 2 simple ones; listing; privacy labels; review notes | Approve the listing | — |
| 14 | Release builds; TestFlight + Play closed test | TestFlight run-through | **M7:** store-ready |
| 15 | Fixes; submit; runbook | Submit; sign off | **M8:** submitted |

**Cut to v1.0.1 / days 22–35 (no gate needed):** the Test Day detail (S8 extras), Cab Mode background audio, the rule-change watch, the 5 SEO seed pages (**days 22–25, not launch** [DECIDED 2]), screenshots 4–6, endorsement banks to 80, glossary to 150. Android production may trail iOS by the Play closed-test window.
**Never cut:** the 2-minute placement check [DECIDED 4], the exact-format engine, the Proof sheet with citations, the honest paywall, Replay-first Results/Review, large type + Sun Mode + a11y, the no-loop onboarding, HazMat + TX CR 100% human-checked, Report a mistake + the fix log screen, the usability check.
**Binding constraint:** Sean's review hours (~10 h total), not Claude Code.

---

## 10. Stage gates and the kill line (from spec v2 §13)
Sales = paid purchases per 30 days, both stores. Net per purchase (15% cut): Permit $12.74 · Endorsement $4.24 · All Endorsements $16.99. $1k/mo net ≈ 54 sales/mo [E].

| Gate | Trigger | Unlocks |
|---|---|---|
| **Gate 0: launch** | Submission (~day 15), **only after the §12.1 pre-launch checklist is green, including lawyer trademark clearance** [DECIDED 6] | The app as above; days 22–35: the cut items, the rule-change watch; **5 SEO seed pages in days 22–25** [DECIDED 2] |
| **Day 30 check** | < 10 sales, or page→install < 20%, or install→purchase < 2% | No new scope. Rework listing, screenshots, paywall placement. **Never** add ads or subscriptions |
| **Gate 1** | Day 30 ≥ 10 sales **and** days 31–60 ≥ 25 sales/mo | Programmatic SEO pages; all 51 jurisdictions in StateFormat; endorsement modes (HazMat renewal, air-brake restriction removal, CLP→skills checklist); endorsement banks to 80 |
| **Kill line (day 60)** | Days 31–60 < 25 sales/mo and not rising week over week | **Stop new feature work.** Maintenance mode (~1 h/week; watch keeps running; fixes only for wrong answers/format changes). Rotate the engine to the next exam |
| **Gate 2** | ≥ 50 sales/mo for 4 straight weeks | Miss-rate pages, the Spanish English-test bridge (a paid reviewer needs Sean's OK), the pre-trip audio trainer, the video pipeline, test-day topic check-in |
| **Gate 2 hold** | 25–49 sales/mo | Keep Gate 1 work 30 more days; still < 25 at day 90 = kill line |
| **Gate 3** | ≥ 80 sales/mo for 4 straight weeks | Voice answers in Cab Mode, a $19.99 Permit price test, the motorcycle app (separate app), an optional paid examiner review (needs Sean's explicit OK) |

A gate unlocks work; it never forces it.

---

## 11. Store listing (draft)
- **iOS title:** "Steady CDL: Permit Test Prep" (28 chars) [VERIFY]. **Subtitle:** "Your state's exact CDL test" (27) [VERIFY].
- **Play short description:** "Your state's exact CDL test. Every answer cited. Pay once, no ads."
- **Screenshots 1–3:** `design/store/appstore-01-pay-once`, `-02-your-state`, `-03-sources` (1290×2796). Remove the "Draft · sample content" footer and replace the sample content with verified content before upload.
- A "Not affiliated with any government agency" disclaimer in the description and in Settings.
- Review notes: original content, sources, one app per exam (4.3).

---

## 12. Decisions (approved Oct 28, 2026)
Approved by Sean on Wed Oct 28, 2026 (PT). These are requirements now, not questions.
1. **[DECIDED 1] The Permit Pack unlocks all states.** One `permit_pack` purchase covers NAT and every jurisdiction, including ones added later. No per-state SKUs (also avoids 4.3 spam risk). Entitlements are state-agnostic; changing state never re-locks content.
2. **[DECIDED 2] The 5 SEO seed pages ship in days 22–25, not at launch.** Pages: `/hazmat-practice-test`, `/texas-cdl-practice-test`, `/cdl-air-brakes-practice-test`, `/texas-commercial-rules-test`, `/tanker-endorsement-practice-test`, built from the content DB (Astro on Cloudflare Pages). Don't build them before submission.
3. **[DECIDED 3] Free tier = the first lesson of every unit + one practice test per section**, with full Proof sheets, citations, audio and Review of their misses. Everything else is behind the matching product. Paywall trigger and copy per S9: context "You finished the free {Unit} lesson." and "Your free lesson and practice test in every unit stay free." (The earlier mock line "Free lessons stay free." is retired.)
4. **[DECIDED 4] The 2-minute placement check ships at launch** (S1, days 4–6). It is in the "never cut" list.
5. **[DECIDED 5] Review intervals: 1, 2, then 4 days, until answered right twice in a row** (§4.3). This replaces spec v2's 1/2/4/7/14 Leitner boxes.
6. **[DECIDED 6] Lawyer trademark clearance of "Steady CDL" is a pre-launch gate.** Sean handles it outside the build; Claude Code does nothing for it except leave the name in one config constant (`APP_NAME`) so a rename is a one-line change. The quick check (Oct 28) found no "Steady CDL" app or mark, but several live "STEADY" marks and ~40 "Steady" apps exist; domains steadycdl.com, getsteadycdl.com and steadycdl.app were unregistered.

### 12.1 Pre-launch checklist (all must be green before submission)
- [ ] **Trademark clearance by a lawyer: done, name confirmed** (Sean) [DECIDED 6]
- [ ] **Sample content replaced** with verified content in every screen, screenshot and listing asset (mocks use placeholder manual section numbers, e.g. "§5.x", and the Proof sheet screenshot says "section no. is a placeholder")
- [ ] **"Draft · sample content" footer removed** from the App Store screenshots (and no "Sample content · mock" badge anywhere)
- [ ] **Endorsement-only users see endorsements first** on Home and the paywall, never the Permit Pack first (the v2 paywall mock shows the Permit Pack first; that's the permit-goal layout only)
- [ ] 0 mid-test/mid-lesson paywall views across the Maestro suite
- [ ] Free tier matches [DECIDED 3] exactly (first lesson per unit + one practice test per section unlocked with no purchase)
- [ ] Placement check works and never blocks or opens the paywall [DECIDED 4]
- [ ] No truncation at the largest Dynamic Type size (snapshot); onboarding no-loop test green on 4 sizes
- [ ] 100% of questions have a citation, Source card and Last checked; HazMat + TX CR 100% human-checked; sample error ≤ 2%
- [ ] StateFormat TX/CA/FL/NAT verified with sources
- [ ] Restore on a fresh install and a 2nd device; Permit Pack stays unlocked after changing state [DECIDED 1]
- [ ] No ads/attribution/tracking SDK; privacy labels match
- [ ] "Not affiliated with any government agency" disclaimer; no pass claims

## 13. Working agreement for Claude Code
- Small PRs per screen/feature; each PR lists which acceptance criteria it meets and attaches simulator screenshots at default and largest text size.
- Never invent regulatory facts. Content you draft is `review_status: 'draft'` until verified; mark unknowns [VERIFY].
- Keep all user-facing strings in one `copy.ts` so the "never say" list can be linted. Fail CI on: "guarantee", "pass first", "real test questions", "actual test", "streak", "pass rate". "Official"/"DMV"/"DPS"/"FMCSA" may appear only in source lines (e.g. "official manual", "Source: TX DPS"), never in the app name, title, headlines or claims.
- Ask before adding any dependency that phones home. Ask before any purchase or external account action.
