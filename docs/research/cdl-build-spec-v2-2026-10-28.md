# CDL Permit & Endorsement Prep: Build Spec v2 (lean MVP + stage gates)
**For:** Claude Code (`brief` agent), with Sean as owner and reviewer. **Written:** Wed Oct 28, 2026, PT. **Replaces:** `cdl-build-spec-2026-10-28.md` (v1, kept unchanged).

**Folds in:**
- the §14 diff in `cdl-ux-differentiation-2026-10-28.md`;
- the positioning and moat stack in `cdl-moat-2026-10-28.md`;
- the factory rule Sean confirmed: *many lines in the water, rotate, invest only in the handful of winners.*

**Marking:**
- [VERIFY] = confirm from the primary source before shipping.
- [E] = estimate. [J] = judgment.
- **[LEAN-MOVE]** = can move after launch to shorten the MVP (§13).

---

## 0. What changed from v1 (summary)

| Area | v1 | v2 |
|---|---|---|
| Positioning | "$34.98 once. Everything. Forever. No ads. No auto-renew." | Leads with exactness and proof: "The CDL test prep that matches your state's real test, fixed in public when the rules change." Price line is second (§1) |
| Design | Not specified | 5 design principles, brand direction, large type, Sun Mode and accessibility are P0 (§1, §8) |
| Practice feedback | Inline explanation | **Proof sheet** with a source card (paraphrased excerpt + official manual link) (§5) |
| Results | Score first | Leads with **Replay mistakes**, default filter "Missed" |
| New screen | — | **Test Day plan** (countdown, Ready check, exam-day card) [LEAN-MOVE] |
| Paywall | From any locked item | Only at a section boundary **after the free test completes**; never mid-test; no trial; guardrail metric = 0 mid-test views |
| Onboarding | 3 steps | Max 3 screens, searchable state list, "Not sure — use national", **no-loop QA test** |
| Listen mode | P1 | Renamed **Cab Mode** (P1), with safety line; lock-screen audio [LEAN-MOVE] |
| Moats in MVP | Source chip, fix log | **Exact-format engine** (TX/CA/FL + national at MVP; data model ready for 51 jurisdictions), manual citations, **rule-change watch + public fix log** (week 3 if it fits, else days 22–35) |
| Content lint | 6 checks | + reading grade ≤ 8, grammar pass, figure check, section integrity, state scoping, HazMat trap regression |
| Post-MVP | Calendar (days 22–35) | **Stage gates tied to sales** (Gate 0–3), kill lines kept (§13) |
| Scope | 21 days | Full v2 = 21 days. **Lean MVP ≈ 15 days [E]** (§12) |
| New | — | **§16 Factory template**: reusable modules for the next licensing-exam apps |

---

## 1. Product summary, positioning and design principles
**What it is:** a mobile CDL knowledge-test prep app.
- **Permit (CLP):** General Knowledge, Air Brakes, Combination.
- **Endorsements:** HazMat, Tanker, Doubles/Triples, Passenger, School Bus.
- **States at MVP:** Texas (with the TX Commercial Rules test), California and Florida, plus a national fallback for every other state.
- The data model is ready for all 51 jurisdictions (§6). They unlock at Gate 1.

**Positioning (new, from the moat report):**
> **"The CDL test prep that matches your state's real test, fixed in public when the rules change. Every endorsement, $34.98 once. No ads, no auto-renew."**

- App Store subtitle: "Your state's exact CDL test" (27 chars) [VERIFY final characters against the name].
- Price microcopy: "Pay once. Yours to keep. No ads. No auto-renew."

**Three proof points** (first screen and screenshots 1–3):
1. **Your state's real format.** Exact count, pass mark, answer choices and order, each with its source. For example: TX Commercial Rules is taken first; 20 questions, 80% [VERIFY TX DPS].
2. **Every answer shows its source.** Manual section, CFR reference and "Last checked", plus a public fix log.
3. **Honest pricing.** One-time only, a free test in every section, Restore that works, no trial, never a mid-test paywall.

**Design principles** (every screen is checked against these):
1. **Never interrupt.** No mid-test paywalls, prompts, rating asks or sounds.
2. **Show the proof.** The source is one tap away on every answer.
3. **Never lose anything.** Autosave on every answer; resume exactly.
4. **Readable anywhere.** Large type, glare-proof Sun Mode, no truncation, one-handed.
5. **Plain English.** About an 8th-grade reading level or lower, with terms defined inline.

**Brand direction:**
- **Feel:** calm, factual, built for professionals, "a good instructor who tells you straight." Not a game, not hype.
- **Type:** Atkinson Hyperlegible, or Inter if it renders better in React Native. Body text at least 18pt, scaling to accessibility sizes. Tabular numbers for scores.
- **Color:** charcoal on off-white with one road-sign accent (highway green; amber as accent only). Right and wrong always use color + icon + word. **Never use hazmat placard colors as decoration.** Dark mode follows the system. Sun Mode is maximum contrast with thicker strokes.
- **Imagery:** line icons; original diagrams only where the manual has one (air brakes, placards). No mascots, laurels or "PASSED" stamps.
- **Never say:** "pass first try", "real test questions", a pass rate, "Official", "DMV" or "DPS" in the name.
- **Motion and sound:** subtle. No autoplay sound. Haptics on answer, with a toggle.

**Pricing** (unchanged; approved):

| Product | Price | Unlocks |
|---|---|---|
| Free | $0 | One practice test per section, with full Proof sheets, citations and audio. No ads, ever. |
| Permit Pack | $14.99 once | GK, Air Brakes, Combination for every state (TX adds Commercial Rules); full bank, simulator, Replay mistakes, readiness |
| Endorsement (each) | $4.99 once | One of the 5 endorsements |
| All Endorsements | $19.99 once | All 5, including modes added later |
| Permit + All | $34.98 | Permit Pack + All Endorsements |

- **Rules:** no subscriptions, trials, ads SDK or rewarded ratings.
- **Price test:** $19.99 Permit Pack only at Gate 3.
- **[VERIFY]:** store price points exist. If "Everything" is ever a single SKU, use the nearest point ($34.99).

## 2. Target users (unchanged from v1)
1. First-time CLP applicants, in or near ELDT (about 390k a year [E]).
2. CDL holders adding an endorsement or renewing HazMat (endorsement-only mode; never pushed to Permit).
3. TX and FL test-takers facing English-only knowledge tests (FL since Feb 6, 2026; TX since Jun 1, 2026):
   - plain-English explanations, glossary and audio;
   - test content stays in English.
   - The Spanish "English-test bridge" waits for Gate 2.
4. Recruits referred by carriers or schools. This is organic only; no outreach.

## 3. Platform and stack (unchanged from v1)
- **App:** Expo (React Native, TypeScript), Expo Router.
- **Data and state:** `expo-sqlite` (read-only content DB + user DB); Zustand persisted to SQLite.
- **Purchases:** RevenueCat free tier or `react-native-iap` (decide Day 4).
- **Audio:** `expo-speech`.
- **Updates, analytics, crashes:** EAS Update for OTA content; PostHog anonymous; Sentry.
- **Backend and web:** Cloudflare Worker + D1 for mistake reports; Astro on Cloudflare Pages for the web.
- **CI and tests:** EAS Build, Jest, one Maestro flow.
- **Hard rule:** no ads, attribution or tracking SDK. Privacy label: "Data Not Used to Track."
- **New, for the rule-change watch:** a scheduled GitHub Action or Cloudflare Cron Trigger (free tier) (§7.8).

## 4. One-time IAP setup (unchanged from v1, plus stricter paywall rules)
**Product IDs:**
- `permit_pack` $14.99
- `endo_hazmat` / `endo_tanker` / `endo_doubles` / `endo_passenger` / `endo_schoolbus` $4.99 each
- `endo_all` $19.99

**Store requirements:**
- Entitlements are checked at launch and on foreground (StoreKit 2 `currentEntitlements` + `Transaction.updates`).
- Restore is always visible on the paywall and in Settings.
- Play purchases are acknowledged within 3 days.
- Family Sharing is on for iOS non-consumables. Don't promise it on Android [VERIFY].
- Refunds re-lock quietly.
- Entitlements are cached for offline use.
- Apple Small Business Program (15%).

**Paywall rules (new, strict):**
1. The paywall opens only:
   - (a) at a section boundary after the free test is **completed**; or
   - (b) when the user taps a locked item.
   It **never** opens mid-test, mid-drill or in Cab Mode.
2. Copy: live store prices, then "Pay once. Yours to keep. No ads. No auto-renew." The screen lists what's free and what each item unlocks.
3. No trial, no countdown timers, no "limited offer", no pre-checked bundle.
4. Bundle math: "All Endorsements $19.99 (you own N)".
5. Close (×) is always visible, at least 44pt, top-left or top-right, with no delay.
6. Endorsement-goal users never see the Permit Pack first.
7. The guardrail metric `paywall_viewed{mid_test:true}` must equal **0**. A CI or analytics alert fires if it's ever above 0.

## 5. Screens and user flows

**Screens:**
1. **Onboarding (max 3 screens, no account):**
   - (1) Searchable state list with TX/CA/FL pinned and "Not sure — use national".
   - (2) Goal: "Getting my permit", "Adding an endorsement" or "Renewing HazMat".
   - (3) "What's free" card, then straight to Home.
   - **QA test:** the state picker can't loop. Run Maestro on small and large Android screens and iPhone SE/Pro Max.
2. **Home:** section cards, each showing readiness, free or unlocked status, and "Continue". HazMat comes first for endorsement-goal users. On a state-specific track it shows a **format card**, e.g. "Texas: Commercial Rules (20 Q · 80%) → GK (50 · 80%) → …", with a source link.
3. **Section detail:** Free test, Practice by topic, Simulator, Replay mistakes, Cab Mode.
4. **Question screen:**
   - full-width answer rows that wrap, with no truncation at any size;
   - tap targets of at least 48pt;
   - a state badge on state-specific questions;
   - Read aloud and Flag buttons.
5. **Proof sheet** (practice mode, after each answer):
   - "Correct" or "Not quite", then the right answer in bold.
   - **Why** in 1–3 plain sentences.
   - Source chip, e.g. `TX CDL Handbook §9.6.2 · 49 CFR 172.202 · Last checked Oct 2026`.
   - Buttons: 🔊 Read aloud, Flag a problem, Continue.
   - Tapping the chip opens a **Source card**: a paraphrased excerpt (≤240 chars, never verbatim) plus a link to the free official manual.
   - Misses go to the Replay queue automatically.
6. **Simulator:**
   - the verified state format (count, pass mark, answer choices, time limit only if published);
   - no feedback until the end, "like the DMV."
7. **Results:**
   - leads with **"Replay N mistakes"** as the primary CTA;
   - the filter defaults to Missed;
   - then score, pass/fail and topic breakdown.
8. **Replay mistakes:** spaced-repetition queue (Leitner, 5 boxes: 1/2/4/7/14 days).
9. **Test Day plan** [LEAN-MOVE → v1.0.1]:
   - optional test date and countdown ring;
   - **Ready check** per section ("Seen 92% · Mastered 78% · Last 3 sims 84/88/90");
   - "Two topics holding you back";
   - today's plan in minutes;
   - the night before: "Replay all mistakes" plus an **Exam-day card** (state format from StateFormat; "what to bring" only once sourced [VERIFY]).
10. **Cab Mode** (was Listen mode):
    - big type, Sun Mode, 2 buttons;
    - reads question, pause, options, pause, answer and why;
    - speed 0.75–1.5×; works offline;
    - safety line at start: "Listen only — don't use the screen while driving";
    - lock-screen and background audio [VERIFY] [LEAN-MOVE];
    - voice answers come at Gate 3.
11. **Glossary:** plain-English and searchable; tap-to-define in questions; optional Spanish gloss on terms only.
12. **Paywall:** per the §4 rules.
13. **Settings:** state, goal, text size, Sun Mode, voice and speed, Restore, "What's new and fixed" (fix log), privacy, support.
14. **Report a mistake:**
    - reasons: Wrong answer / Outdated / Not in my state's manual / Confusing wording / Typo / Other;
    - optional note; question ID attached automatically;
    - confirmation: "Thanks — we check every report. Fixes appear in What's new."

**Key flows:**
- **First run:** state → goal → Home → free GK test → Results ("Replay N mistakes") → *then* a soft paywall card at the section boundary.
- **Purchase** returns the user to the exact place. **Restore** needs no account.
- **Endorsement-only:** the HazMat free test, then the $4.99 / $19.99 paywall. Permit is never required.
- **Autosave** on every answer. Interruptions resume. A back swipe asks for confirmation.
- **Rating prompt:** native API, at most once, **only on Home** after the 2nd passed simulator. Never in a session and never tied to a reward.

## 6. Data model (v1 plus new fields)
```ts
type Jurisdiction = 'NAT'|'AL'|'AK'|...|'WY'|'DC';  // all 51 + NAT defined now; only NAT/TX/CA/FL populated at MVP
type Section = 'GK'|'AIR_BRAKES'|'COMBINATION'|'TX_COMMERCIAL_RULES'|'HAZMAT'|'TANKER'|'DOUBLES_TRIPLES'|'PASSENGER'|'SCHOOL_BUS'
  | 'HAZMAT_RENEWAL'|'AIR_BRAKE_RESTRICTION'; // last two reserved for Gate 1
interface Question {
  id: string; state: Jurisdiction; section: Section; topic: string;
  question: string; options: string[]; answer_index: number; explanation: string;
  manual_citation: string; manual_edition: string; regulation_ref?: string;   // e.g. "49 CFR 172.504"
  cfr_sections: string[];        // NEW: machine-readable, e.g. ["49/172/504"]; the rule-change watch keys on these
  source_a: {doc:string; locator:string; url?:string}; source_b: {doc:string; locator:string; url?:string};
  source_excerpt_paraphrase: string;  // NEW: <=240 chars, never verbatim (CI check)
  official_manual_url: string;        // NEW
  figure_asset?: string;              // NEW: lint fails if the text says "shown/figure/diagram" without one
  reading_grade: number;              // NEW: computed in CI
  verified_a_by: string; verified_b_by: string; last_checked: string;
  review_status: 'draft'|'agent_verified'|'human_verified'|'published'|'flagged'|'retired';
  difficulty: 1|2|3; glossary_terms: string[]; free_tier: boolean; version: number; change_note?: string;
}
interface StateFormat {             // the exact-format engine; one row per jurisdiction x section
  state: Jurisdiction; section: Section; required_for: ('A'|'B'|'C'|'ENDO')[];
  order: number;                     // e.g. TX Commercial Rules = 1
  question_count: number; pass_pct: number; options_per_q: 3|4; time_limit_min?: number;
  test_language: 'en_only'|'en_plus'; languages?: string[];   // FL/TX = en_only (2026)
  manual_edition: string; manual_model: 'legacy'|'aamva_modernized'|'unknown';
  source_url: string; last_checked: string; verified_by: string; notes?: string;
}
interface WatchedSource { id: string; kind: 'ecfr_part'|'fed_register_query'|'manual_url'|'dmv_page';
  target: string; last_hash: string; last_seen: string; }
interface FixLogEntry { date: string; question_id?: string; state?: Jurisdiction; version: number;
  kind: 'user_report'|'rule_change'|'manual_edition'|'format_change'; summary: string; source_url?: string; }
interface GlossaryTerm { term: string; plain: string; es_gloss?: string; citation?: string; }
```
- **User DB:** unchanged from v1 (attempts, srs, sims, progress, entitlements, pending_reports), plus `test_date` and `settings(text_size, sun_mode, haptics)`.
- **Simulator defaults** (national fallback): GK 50 / Air Brakes 25 / Combination 20 / HazMat 30 / Tanker, Doubles, Passenger, School Bus 20 each, all 80% [VERIFY each state].
- **Known format facts to load** (from the moat report; [VERIFY] each one on Day 1–2):
  - TX: Commercial Rules 20 Q / 80%, taken first. A third-party site says 25, so resolve against TX DPS.
  - CA: GK 50 Q, 10 misses allowed.
  - FL and TX: English-only.
  - NY and IA: 3 answer choices (Gate 1 rows).
- Ship nothing in the simulator that StateFormat hasn't verified.

## 7. Content pipeline
**Sources** (unchanged):
- **Allowed:** 49 CFR (public domain), FMCSA guidance, and state manuals paraphrased with section citations.
- **AAMVA:** the model manual is copyrighted; paraphrase only.
- **Forbidden:** competitor banks, leaked or "actual test" questions, scraping competitors.

**Steps 1–4** (unchanged): topic map → agent draft → agent Check 1 (fresh context, source_b) → human Check 2.
- Human Check 2 covers 100% of HazMat and TX Commercial Rules, every flagged item, and a 20% sample of the rest.
- A batch goes back if the sample error rate is over 2%.

**Step 5, CI lint (v1 checks plus new):**
- **v1 checks:**
  - exactly one correct answer;
  - no unintended "all/none of the above";
  - options of similar length;
  - citation and both sources present, `last_checked` ≤ 12 months;
  - no 12+ word verbatim match against source PDFs;
  - near-duplicate check (embedding similarity > 0.92).
- **New checks:**
  - Explanation reading grade ≤ 8 (Flesch-Kincaid).
  - Grammar and spelling pass (LanguageTool) on question, options and explanation.
  - `source_excerpt_paraphrase` ≤ 240 chars and fails the verbatim check against the manual.
  - Figure check: references to a figure require `figure_asset`.
  - Section integrity: `section` matches the topic map (no bus questions in Combination).
  - State scoping: non-NAT questions are only drawn for their state.
  - No repeated IDs or near-duplicates within one simulator draw.
  - **Known-trap regression tests**, e.g. HazMat basic-description order (ID → proper shipping name → class → packing group, 49 CFR 172.202 [VERIFY]).
  - Every published question has non-empty `cfr_sections` or a manual citation that maps to a WatchedSource.

**Step 6, Report a mistake** (unchanged):
- reports go to D1, with a daily digest to Sean;
- triage within 72h;
- a fix bumps `version`, writes a FixLogEntry and ships OTA;
- 3+ reports auto-hide the question.

**Step 7, re-check:** quarterly, plus whatever the watch flags.

**Step 8, rule-change watch (new; moat #2):**
- **What it does:** a daily job (GitHub Action or Cloudflare Cron) runs three checks and writes a digest to Sean:
  1. **eCFR versioner API** (`/api/versioner/v1/versions/title-49.json?part=N`) for Parts 383, 391, 392, 393, 395, 396, 397 and 172. A new amendment date flags every question whose `cfr_sections` sits in that part.
  2. **Federal Register API** for PHMSA and FMCSA rules and NPRMs (e.g. HM-215S, comments due Dec 28, 2026). These are logged as "watching", with no question change until final.
  3. **Hash of each state manual and DMV CDL page** (TX DPS, CA DMV, FL FLHSMV at MVP). A change flags that state's StateFormat rows and questions.
- **Output:** flagged items go to `review_status: 'flagged'`. A fix ships OTA with a `rule_change` FixLogEntry.
- **Public log:** `/fixes` lists every entry with date, what changed and the source link, both in-app and on the web.
- **Why it matters:** in 2026 so far, Part 383 has had 8 amendment dates and Part 172 has had 7 (moat report). That record compounds and can't be backfilled.
- **Placement:** MVP days 18–20 *if it fits*. Otherwise Gate 0+, days 22–35. It's a separate job with no app-review dependency.

**Launch content targets:**

| Section | v1 | **Lean v2** [E] | Note |
|---|---|---|---|
| General Knowledge | 300 | 250 | 5 non-repeating 50-Q sims |
| Air Brakes | 120 | 100 | |
| Combination | 100 | 80 | |
| TX Commercial Rules | 80 | 60 | 3 sims; 100% human-checked |
| HazMat | 200 | 160 | 100% human-checked |
| Tanker / Doubles / Passenger / School Bus | 80 each | 50 each | 2.5 sims each. Grows OTA to 80 at Gate 1 [LEAN-MOVE] |
| **Total** | ~1,120 | **~850** | Cuts Sean's review from about 13h to about 10h [E] |

- Free tier: 1 set per section (20 Q, or 30 for GK).

## 8. Features, prioritized (v2)

| P | Feature | Done means |
|---|---|---|
| P0 | Offline question engine with autosave | Airplane mode works; killing the app mid-test resumes on the same question |
| P0 | **Exact-format engine** (StateFormat for TX/CA/FL + NAT; 51-jurisdiction schema) and format card | Choosing a state changes the bank, simulator and order; every row has source + last_checked |
| P0 | Proof sheet + source chip + Last checked + Source card | 100% of published questions; CI fails otherwise |
| P0 | Free test per section; strict paywall rules (§4) | Reachable with no prompt; 0 mid-test paywall views in QA |
| P0 | One-time IAP + Restore + Family Sharing (iOS) | Buy → delete → reinstall → Restore works on both stores |
| P0 | Simulator in the state's format | Matches verified StateFormat |
| P0 | Results leading with **Replay mistakes** + Leitner drill | Results CTA = Replay; queue persists |
| P0 | HazMat first; TX Commercial Rules | HazMat and TX CR 100% human-checked |
| P0 | **Large type, Dynamic Type to accessibility sizes, Sun Mode, no truncation** | Snapshot test at the largest size passes on key screens |
| P0 | **VoiceOver/TalkBack** on question, Proof sheet and results | Manual audit passes |
| P0 | 3-screen onboarding, no-loop | Maestro no-loop test passes on 4 screen sizes |
| P1 | Cab Mode (foreground audio) | TTS sequence, speed control, offline, safety line |
| P1 | Report a mistake + public fix log | A report reaches D1 within 1 minute online; fix log renders |
| P1 | Readiness score on Home and Results | Formula as v1; "Likely ready" ≥ 85; "a study guide, not a guarantee" |
| P1 | Glossary + tap-to-define | **80 terms at MVP** (v1: 150) [LEAN-MOVE the rest] |
| P1 | Rule-change watch (§7.8) | Daily digest runs; flags propagate |
| P1 → v1.0.1 | Test Day plan + Ready check breakdown | [LEAN-MOVE] |
| P1 → v1.0.1 | Cab Mode lock-screen/background audio | [LEAN-MOVE] [VERIFY] |
| P2 | Endorsement-only mode (hide permit upsells) | Goal = endorsement hides Permit cards |
| P2 | Dark mode | Follows the system |

- **Readiness formula** (unchanged): `0.5×mastered + 0.3×avg(last 3 sims) + 0.2×seen`. Never claim a pass rate.
- **Out of scope until a gate unlocks it:**
  - 48 more states, SEO beyond the seed pages, endorsement modes (Gate 1).
  - Miss-rate pages, Spanish bridge, pre-trip audio, video pipeline (Gate 2).
  - Voice answers, price test, motorcycle, paid examiner review (Gate 3).
- **Never:** subscriptions, ads, accounts, live AI chat, a pass guarantee (Apple controls IAP refunds), leaderboards, a community forum.
- **Roadside English** (v1 fast-follow) moves into the Gate 2 Spanish bridge.

## 9. Store listing, ASO and naming
- **Naming rules** (unchanged):
  - no "Official/DMV/DPS/FMCSA" or seals;
  - avoid "CDL Practice Test®" (PATG mark);
  - Sean runs a USPTO search.
- **Names:** HaulReady, Straight Answers CDL, CleanRun CDL, Plainspoke CDL, CDL Proof, Checkride CDL.
- **iOS:** title "HaulReady: CDL Permit Test". Subtitle "Your state's exact CDL test". Keywords as v1, plus "audio" and "hazmat practice" [VERIFY character budget].
- **Play short description:** "Your state's exact CDL test. Every answer cited. Pay once, no ads."
- **Screenshots:**
  1. "Pay once. No ads. No auto-renew."
  2. "Every answer shows its source." (Proof sheet with the source card open)
  3. "Texas? Commercial Rules included. HazMat done right." (format card + HazMat placard question)
  4. Ready check / Test Day (use Results + readiness if Test Day is LEAN-MOVED)
  5. Cab Mode
  6. "See what we fixed" (fix log)
- **Screenshot visuals:** neutral background, one accent, large type, no mascots, laurels or "first try" claims.
- **Description:** add "readable", "audio", "no ads", "your state's format".
- **4.3 spam mitigation** (unchanged, and more important under the factory model; see §16): one app per exam, a distinct UI and original bank, detailed review notes, a "not affiliated with any government agency" disclaimer.

## 10. Analytics events (anonymous; PostHog)
- **v1 events kept:** onboarding, free test, question_answered (10% sampled), sim, paywall, purchase, restore, drill, glossary, readiness, trust, rating, app_open.
- **New events:**
  - `onboarding_screen_viewed{n}`, `state_picker_repeat{count}` (loop detector)
  - `text_size_changed{size}`, `sun_mode_toggled{on}`
  - `proof_sheet_source_opened{qid}`, `official_manual_opened{state}`
  - `replay_mistakes_started{n}`, `replay_mistakes_completed{n,correct}`
  - `format_card_viewed{state}`
  - `test_date_set{days_out}` (once Test Day ships)
  - `cab_mode_started{section}`, `cab_mode_minutes`
  - `paywall_viewed{trigger, section, after_free_test_completed:bool, mid_test:bool}`
  - `fixlog_viewed`, `watch_flag_resolved{kind}` (server-side)
- **Guardrails** (alert if breached):
  - `paywall_viewed{mid_test:true}` = **0**;
  - `state_picker_repeat > 2` in < 1% of installs;
  - mistake reports < 0.5 per 1,000 answers.
- **Gate dashboard:**
  - store page→install; install→free test completed; free test→paywall→purchase;
  - **paid sales/mo** (the gate metric), revenue per install;
  - D1/D7 retention, report rate.

## 11. Milestones and acceptance (full v2, 21 days)

| Milestone | Day | Accept when |
|---|---|---|
| M1 Foundations | 3 | App runs on iPhone and Android; content DB loads; question screen + autosave; CI lint; **design tokens (type ramp, color, Sun Mode)** in code; **snapshot test at the largest Dynamic Type size**; StateFormat rows for TX/CA/FL/NAT with sources |
| M2 Core loop | 7 | Practice with Proof sheet, simulator in state format, Results leading with Replay mistakes, drill, readiness, 3-screen onboarding with no-loop test, all offline on 100 sample Qs |
| M3 Content wave 1 | 10 | GK, Air Brakes, Combination, HazMat at 70% of target; HazMat 100% human-checked; new lint clean |
| M4 Monetization | 12 | 7 products sandbox-tested; Restore on a 2nd device; refunds handled; paywall rules pass QA (0 mid-test); no ads/tracking SDK |
| M5 Trust + accessibility | 14 | Source card on 100%; Report a mistake + offline queue; fix log; Cab Mode; VoiceOver/TalkBack; **3–5 person usability check done** (people Sean knows; no public recruiting posts without Sean's approval) |
| M6 Content complete | 17 | All sections at target; TX/CA/FL overrides; 20% sample error ≤ 2% |
| M7 Store-ready | 19 | Screenshots 1–6, listing, privacy labels, review notes, Maestro smoke on release builds, TestFlight + Play closed test live; rule-change watch running (if it fits) |
| M8 Submitted | 21 | Submitted to App Review and Play (or closed test running); Sean signs off |

## 12. Schedules

### 12a. Full v2 schedule (21 days)
CC = Claude Code. Sean's time is 1–2 h/day plus review blocks.

| Day | Claude Code | Sean |
|---|---|---|
| 1 | Scaffold, SQLite schema (§6, all 51 jurisdictions defined), CI; draft StateFormat TX/CA/FL/NAT with sources | Name + USPTO; Apple and Play accounts, Paid Apps, Small Business Program |
| 2 | Question screen, answer rows, autosave, source chip; lint script (v1 + new) | **Design day: tokens and type ramp in Figma (2h)**; verify StateFormat rows; download manuals with editions |
| 3 | Topic maps; start GK + HazMat drafts; tokens in code; snapshot test. **M1** | Approve topic maps; create app records |
| 4 | Simulator + Results (Replay-first); choose RevenueCat or react-native-iap; draft Air Brakes | Create 7 IAPs; sandbox tester |
| 5 | **Proof sheet + Source card**; Replay drill; readiness; Home + format card; Check 1 on GK batch 1 | HazMat batch 1 review (100%) |
| 6 | 3-screen onboarding + no-loop Maestro test; interruptions/resume; draft Combination + TX CR | **Design day: Proof sheet + Test Day wireframes**; start the Play closed test (R5) |
| 7 | Unit tests; demo build. **M2** | Device test; UX notes |
| 8 | HazMat → 115, GK → 175; Check 1 | HazMat batch 2 (100%), GK sample |
| 9 | Air Brakes → 70, Combination → 55, TX CR → 40 | TX CR (100%), sample |
| 10 | Integrate wave 1. **M3** | Sign off M3 |
| 11 | IAP + strict paywall | Sandbox purchases |
| 12 | Restore, refunds, Play ack, SDK audit. **M4** | 2nd-device restore |
| 13 | Report a mistake (Worker + D1), fix log; draft Tanker + Doubles | Support text; privacy policy |
| 14 | Cab Mode, glossary (80), **Sun Mode + accessibility pass**. **M5** | **Usability check (3–5 people)**; Cab Mode ride test |
| 15 | Passenger + School Bus; Check 1 all endorsements; TX/CA/FL overrides; **Test Day plan** | Endorsement samples |
| 16 | Fill to target; dedupe + verbatim; **Test Day plan finish** | Remaining HazMat + samples |
| 17 | Integrate; free sets. **M6** | Error-rate gate |
| 18 | Store assets (screenshots 1–6), listing, privacy; **rule-change watch job (eCFR + FR + 3 manual hashes)** | Approve name, icon, screenshots |
| 19 | Release builds; TestFlight / Play. **M7** | TestFlight run-through |
| 20 | Fixes; review notes; **5 SEO seed pages** (§13, Gate 0) | Final QA |
| 21 | Submit; runbook. **M8** | Submit; sign off |

### 12b. Lean MVP: about 15 working days [E]
**Cuts (all [LEAN-MOVE] items ship as OTA or v1.0.1 within days 22–35, no gate needed):**
1. **Test Day plan + Ready check breakdown → v1.0.1.** Saves about 1.5 CC-days. Readiness on Home/Results stays.
2. **Endorsement banks at 50 each instead of 80; glossary 80 instead of 150.** Saves about 2 days of draft and review, and about 3h of Sean.
3. **Cab Mode background/lock-screen audio → v1.0.1.** Foreground Cab Mode stays. Saves about 0.5 day.
4. **Rule-change watch → days 22–35.** It's a server job with no app-review dependency. Saves about 1 day. The fix log screen still ships, fed by user reports.
5. **SEO seed pages → days 22–25.** Saves about 0.5 day.
6. **Screenshots 4–6 → after launch.** Launch with screenshots 1–3 plus 2 simple ones. Saves about 0.5 day.
7. **Android production can trail iOS** by the Play closed-test window (R5). The build is the same; this doesn't save days, it just means the launch isn't blocked on it.

**What can't be cut** (these are the differentiators):
- exact-format engine for TX/CA/FL + NAT;
- Proof sheet with citations;
- the honest paywall;
- Replay-first Results;
- large type, Sun Mode and accessibility;
- 3-screen no-loop onboarding;
- HazMat + TX CR at 100% human-checked;
- Report a mistake + fix log screen;
- the usability check.

**Lean day plan [E]:**

| Days | Work |
|---|---|
| 1–3 | Foundations (M1, design day 2) |
| 4–6 | Core loop + Proof sheet + onboarding (M2, design day 6) |
| 7–9 | Content wave 1 + IAP |
| 10 | Monetization (M4) |
| 11 | Trust + accessibility + Cab Mode (M5) |
| 12 | Usability check + content complete (M6 at lean targets) |
| 13 | Store assets |
| 14 | Release builds (M7) |
| 15 | Submit (M8) |

- **Binding constraint:** Sean's review hours (about 10h total), not CC.
- **Days saved:** about 6 [E]. Under the factory model, that's about 6 days sooner to the day-30 and day-60 sales signals and to the next line in the water.
- **Recommendation [J]:** build the lean MVP. The cut items are polish or volume, and none of the three proof points depends on them.

## 13. Stage gates, revenue math and kill lines
**Net per purchase** (15% cut): Permit $12.74 · Endorsement $4.24 · All Endorsements $16.99 · Permit + All $29.73. $1k/mo net ≈ 54 sales/mo at an average ticket of about $22 [E]. Sales = paid purchases per 30 days, both stores.

| Gate | Trigger | Unlocks (CC-days [E]) | Sean |
|---|---|---|---|
| **Gate 0: MVP launch** | Submission (lean ≈ day 15) | App as §8. Within days 22–35, no gate: the [LEAN-MOVE] items, the **rule-change watch** (3–4), and **5 SEO seed pages** (`/hazmat-practice-test`, `/texas-cdl-practice-test`, `/cdl-air-brakes-practice-test`, `/texas-commercial-rules-test`, `/tanker-endorsement-practice-test`) built from the content DB (~1) | Search Console; triage reports |
| **Day 30 check (early warning)** | < 10 sales, or page→install < 20%, or install→purchase < 2% | No new scope. Rework listing, screenshots and paywall placement. Never add ads or subscriptions | Review the listing |
| **Gate 1** | **Day 30 ≥ 10 sales *and* days 31–60 ≥ 25 sales/mo** | Programmatic **SEO pages** per state × test (4–6); **all 51 jurisdictions** in StateFormat with format cards (6–8 CC-days + about 17h of human verification at 20 min/row [E]; NY/IA 3-choice etc.); **endorsement modes**: HazMat renewal, air-brake L/Z restriction removal, CLP→skills checklist (4–5); endorsement banks to 80 | State-row verification (or Lindsey) |
| **Kill line (day 60)** | Days 31–60 **< 25 sales/mo and not rising week over week** | **Stop new feature work.** Maintenance mode (§13.1). Rotate the content engine to the next exam (§16) | Moonbase check on the next niche |
| **Gate 2** | **≥ 50 sales/mo for 4 straight weeks** | **Miss-rate pages** (opt-in aggregate data; "hardest 25 questions in Texas") (3); **Spanish English-test bridge** (bilingual toggle, English term drill, Roadside English, "your state tests in English" banner) (5–7 + paid fluent reviewer, which is a purchase needing Sean's OK); **pre-trip audio trainer** (4–5); **video pipeline** (Q&A videos from the bank, EN + ES, about 2/wk, no paid spend) (3); test-day topic check-in (topics only, never questions) (2) | Spanish review option; video voice approval |
| **Gate 2 hold** | 25–49 sales/mo | Keep Gate 1 work going for 30 more days, then re-check. If still < 25 at day 90, treat it as the kill line | — |
| **Gate 3** | **≥ 80 sales/mo for 4 straight weeks** | **Voice answers** in Cab Mode (3); **price test**: Permit Pack $14.99 → $19.99 for 2 weeks, then compare sales × net; **motorcycle extension** reusing the engine (6,600 searches/mo, KD 30) as a separate app per §16; **optional paid examiner review** ("Reviewed by a retired CDL examiner"), a one-off purchase that **needs Sean's explicit OK** (price not researched) | Approve any spend |

**Rules:**
- A gate unlocks work; it never forces it.
- Lindsey or agent time freed by a kill goes to the next line.
- Gates are checked weekly in the factory dashboard.

### 13.1 Maintenance mode (after a kill, or between gates)
- The app stays live; it costs nothing.
- The rule-change watch keeps running (free tier). Reports are triaged weekly, not every 72h.
- Fixes ship only for wrong answers or format changes.
- About 1h/week of Sean, maximum [E].
- If sales later cross 25/mo organically, re-enter at Gate 1.

## 14. Risks (v1 R1–R9 kept; new and changed)

| # | Risk | Mitigation |
|---|---|---|
| R1–R9 | As v1 | As v1 |
| R4 (updated) | State format or rule changes | The rule-change watch (§7.8) + StateFormat source/last_checked + public fix log |
| R10 | A polished no-ads rival (Hanh Le cheaper lifetime; indie "CDL Prep Ultimate") | Lead with exactness and proof, not design alone; the fix-log record compounds |
| R11 | A source excerpt drifts toward manual text | ≤ 240-char paraphrase rule + verbatim CI check |
| R12 | Lean banks feel thin (50-Q endorsements repeat) | The simulator draws without repeats until the bank is exhausted; banks grow OTA at Gate 1; state the counts honestly in the listing |
| R13 | **Factory 4.3 risk:** many template-based exam apps from one developer account read as spam | §16 rules: distinct brand, UI theme, content and review notes per exam; never per-state clones; space submissions |
| R14 | Spanish/immigrant demand shrinks (FL/TX English-only; non-domiciled rule) | Spanish waits for Gate 2 and is framed as a bridge to the English test |

## 15. Review checklist before submission (new, short)
- [ ] 0 mid-test paywall views across the Maestro suite
- [ ] No truncation at the largest Dynamic Type size (snapshot)
- [ ] Onboarding no-loop test green on 4 sizes
- [ ] 100% of questions have a citation, Source card and Last checked
- [ ] HazMat + TX CR 100% human-checked; sample error ≤ 2%
- [ ] StateFormat TX/CA/FL/NAT verified with sources
- [ ] Restore on a fresh install and a 2nd device
- [ ] No ads/attribution/tracking SDK; privacy labels match
- [ ] Disclaimer and no pass claims

## 16. Factory template (reuse for the next licensing-exam apps)
Each module is built once here, then reused. Each new exam app changes the content and brand, not the machinery.

| Module | What's reusable as-is | Per-exam work [E] |
|---|---|---|
| **Content engine** (schema §6, pipeline §7, lint, two-source + human gate, OTA updates) | Question/Source/FixLog types, agent draft → Check 1 → human gate, all lint rules, verbatim check, dedupe | New `Section` list, topic maps, sources; banks drafted (CC) and reviewed (Sean) |
| **Exact-format engine** (StateFormat-style table + format card + simulator) | Jurisdiction × test table with source/last_checked; the simulator reads it | Rows for that exam (some are federal-only, e.g. one national format) |
| **Rule-change watch + public fix log** | eCFR/Federal Register/URL-hash jobs, flag propagation, `/fixes` page | Point at that exam's CFR parts, agencies and manuals |
| **Honest-paywall module** | One-time IAP wrapper, Restore, entitlement cache, §4 rules, guardrail metric, bundle math | SKU list and prices |
| **Proof-sheet UI kit** | Question screen, Proof sheet, Source card, Results with Replay, Replay drill, readiness, Cab Mode, Sun Mode, large type, a11y, 3-screen onboarding + no-loop test | **New theme per app** (color, icon, type pairing) to avoid 4.3 |
| **SEO page generator** (Astro) | Builds topic and jurisdiction pages, a free quiz widget and Quiz/FAQ schema from the content DB | Keyword list (≤ 15 Semrush rows per niche) |
| **Stage gates + kill lines** | Gate 0–3 structure, day-30 warning, day-60 kill (< 25/mo), maintenance mode, gate dashboard | Thresholds scaled to price (sales needed for $1k/mo net) |
| **Analytics and launch checklist** | Event schema, guardrails, §15 checklist, review-notes template | Exam-specific events |

**Rules for reuse:**
1. **One app per exam.** Never per-state or per-endorsement clones.
2. A **distinct brand, theme and screenshots** per app. Review notes explain the original content and sources (4.3).
3. A **Moonbase check** before each new niche.
4. **No services, no paid ads, no outreach**, the same as here.

**Estimated cost of app #2 [E]:**
- Ship in about 8–12 working days, versus about 15 lean here. The saving is mostly UI, IAP, CI and pipeline reuse.
- Content review stays the bottleneck, scaling with bank size.
- Candidates are already in the queue (e.g. Part 107 is #1). Motorcycle reuses this engine at CDL Gate 3. A car permit app only after a winner, because that market is crowded (33k/mo, KD 59).
