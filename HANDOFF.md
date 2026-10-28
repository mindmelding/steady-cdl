# HANDOFF: Steady CDL (read after CLAUDE.md)

*Written Oct 28, 2026 (PT) for Claude Code working in `mindmelding/steady-cdl`. Everything here comes from the files in this repo. [E] = estimate, [J] = judgment, [VERIFY] = confirm from the primary source before shipping.*

## 1. Who you're working with
- **Sean** is the owner and reviewer. He's strong at design and UX, moves fast, and reviews content himself (his review hours, about 10 h total for the MVP, are the binding constraint, not your build speed).
- He runs a **factory of small launches with kill lines**: many lines in the water, rotate, invest only in the winners. **Steady CDL is app #1.** Build it so the machinery (content engine, exact-format engine, honest paywall, proof-sheet UI kit, rule-change watch, SEO generator, gates) is reusable for the next licensing-exam app. See `docs/research/cdl-build-spec-v2-2026-10-28.md` §16 (Factory template).
- Sean has a day job (Moonbase, an agent-first CX product). Nothing in this repo may compete with it, and nothing here involves services, outreach, paid ads or sales work.

## 2. Product in one line
**Steady CDL: "The CDL test prep that matches your state's real test, fixed in public when the rules change. Every endorsement, $34.98 once. No ads, no auto-renew."**
- A calm, flat black-and-white, lessons-style app (units → bite-size lessons → unit check) for the CDL permit (GK, Air Brakes, Combination; Texas adds Commercial Rules) and 5 endorsements (HazMat, Tanker, Doubles/Triples, Passenger, School Bus).
- MVP states: TX, CA, FL + a national fallback; the schema covers all 51 jurisdictions.
- Three proof points: **your state's real format**, **every answer shows its source**, **honest pricing**.

## 3. Pricing and product IDs (approved; don't change without Sean)
| Product ID | Price | Unlocks |
|---|---|---|
| `permit_pack` | $14.99 once | GK, Air Brakes, Combination (+ TX Commercial Rules), **all states** |
| `endo_hazmat`, `endo_tanker`, `endo_doubles`, `endo_passenger`, `endo_schoolbus` | $4.99 each | One endorsement |
| `endo_all` | $19.99 | All 5 endorsements, incl. modes added later |
- "Everything" = Permit + All = **$34.98**, shown as math, not a SKU. No subscriptions, trials or ads, ever. A $19.99 Permit price test is allowed only at Gate 3.
- RevenueCat, non-consumables, Restore always visible, iOS Family Sharing on, Apple Small Business Program (15%).

## 4. The six approved decisions (Oct 28, 2026; detail in CLAUDE.md §12)
1. The Permit Pack unlocks **all states**; entitlements are state-agnostic.
2. The **5 SEO seed pages ship in days 22–25**, not at launch (`docs/research/data/seo/seo-seed-pages.csv`).
3. **Free tier = the first lesson of every unit + one practice test per section**, with full proof sheets, sources and audio. Paywall copy: "Your free lesson and practice test in every unit stay free."
4. The **2-minute placement check ships at launch**.
5. **Review intervals: 1, 2, then 4 days, until answered right three times in a row.** (Was twice; changed by Sean Oct 28, 2026.)
6. **A lawyer's trademark clearance of "Steady CDL" is a pre-launch gate.** Sean handles it; you only keep the name in one `APP_NAME` constant.

## 5. What the research found (numbers, and where to read more)
| Finding | Numbers | Read |
|---|---|---|
| Reviews: trust is the opening | 3,981 store reviews (2,064 from 2025–26). In 581 recent 1–3★: **monetization traps 33%**, content quality 18%, **ads 16%**, coverage gaps 14% | `cdl-differentiation` §1–2 |
| Hand-coded complaints | 343 complaints: **48% money/ads, 33% accuracy or fit to the real test, 24% reliability**; dark mode came up once in 1,627 negatives | `cdl-ux-differentiation` §0–2 |
| What people love | In 1,483 recent 4–5★: "passed" 28%, **"matches the real test" 10.5%**, explanations/manual references 4.2% | `cdl-differentiation` §3 |
| The money | Appfigures est.: Khai Vuong ~$95k/mo, Best Fun Games ~$65k, DMV Genie ~$35k (iOS), BrainSoft ~$10k (a 2026 entrant); top 4 ≈ $205k/mo [E] | `cdl-differentiation` §1, §5 |
| The free leader | Jeffrey Diaz "CDL Prep": free with ads, 1M+ Play installs; named in 35 of 178 Reddit items; 73 of 95 recent ad complaints | `cdl-differentiation` §2–4 |
| Pricing norms | 9 of 11 iOS rivals sell auto-renewing plans; lifetimes $39.99–$99.99; ours undercuts every confirmed 1-month price | `cdl-pricing` §1–3, `data/pricing/` |
| Search demand (US/mo, KD) | cdl practice test 18,100 (38); hazmat practice test 5,400 (23); texas cdl practice test 1,000 (13); tanker endorsement 1,000 (15); air brakes 880 (9); TX commercial rules 390 (28) | `data/seo/*.csv`, `cdl-moat` §1, §4 |
| Rules keep moving | 2026 eCFR amendment dates: Part 383 = 8, Part 172 = 7, 393 = 4, 391 = 3; PHMSA HM-215S Oct 27, 2026 (comments due Dec 28) | `cdl-moat` §3, `data/regulatory/` |
| English-only tests | FL since Feb 6, 2026; TX since Jun 1, 2026 (UT Jan 20, 2026); Spanish search demand is falling, so Spanish is a Gate 2 "English-test bridge", not a launch feature | `cdl-differentiation` §5, `cdl-moat` §0 |
| Buyer pool | ~390k a year at the Sep 2026 ELDT pace [E]; BLS: 237,600 heavy-truck openings a year | `cdl-differentiation` §5 |
| Economics | Net per sale (15% cut): Permit $12.74, Endorsement $4.24, All Endorsements $16.99. $1k/mo net ≈ 54 sales/mo [E]. Moats move P(≥$1k/mo net) for this app from 11.8% to ~17.8% [J] | `cdl-build-spec-v2` §13, `cdl-moat` §10 |
| Earlier niche scan | Why CDL was picked as app #1 ("crowded but paying") | `law-search-appfigures` |

## 6. Competitors
- **Main rival: Hanh Le** "CDL Test Prep 2026 Class A B": 48,612 iOS ratings at 4.90, free with ads, Remove Ads $5.99, 30-Day Pass $19.99, Lifetime $39.99 (only $5 above our full bundle), all endorsements, Spanish, an "AI Tutor", a "Report mistake" button. Price alone won't beat it; exactness and proof must. (Its revenue was not measured.)
- **Top earners:** Khai Vuong, Best Fun Games, DMV Genie (sub-heavy, poor recent reviews), plus Easy Pass (has a readiness bar), Mapola, PATG (claims FMCSA citations), Solvely (audio, Spanish), BrainSoft (new). Full table: `cdl-pricing` §1 and `docs/research/data/pricing/competitors.csv`.
- **What nobody shows** (0 of 11 descriptions): TX Commercial Rules taken first, NY/IA three-choice formats, modernized manuals, FL/TX English-only rules, a public fix log.

## 7. Moat priorities (build-only, no outreach; `cdl-moat` §1)
1. **Exact-format state engine** (`StateFormat`: count, pass %, choices, order, language, manual edition, source + check date per row).
2. **Rule-change watch + public fix log** (eCFR versioner, Federal Register, manual page hashes; days 22–35).
3. **Programmatic SEO** with real per-state facts (5 seed pages days 22–25; more at Gate 1).
4. Miss-rate data (opt-in, aggregate, Gate 2); test-day topic check-in (topics only, never questions).
5. Cited explanations on every answer (in MVP). Cab Mode and endorsement completeness matter but are easy to copy.
Don't: pass guarantees, partnerships (sales work), a forum.

## 8. Design system (CLAUDE.md §5–6; visuals in `design/`)
- Flat **black on white**, no accent color, no gradients, no shadows. Cab Mode inverts to white on black.
- **Atkinson Hyperlegible** for all reading text, **18 pt minimum**, Dynamic Type to accessibility sizes; **Inter SemiBold** for brand, headings, buttons; **IBM Plex Mono** for citations only.
- The **ring** (12 o'clock, clockwise, round caps, optional pass-mark tick from `StateFormat.pass_pct`) is the product motif; the brand mark is a fixed 80% ring (72° gap) with a dot. Use the SVGs in `design/final/`; never re-typeset the wordmark.
- **The one rule: correct/incorrect is always icon + word, never color alone.**
- The 10 v2 mocks in `design/png/` are the layout source of truth (`design/README.md` explains how to re-render them).

## 9. Hard "do not" rules
- No ads, ads SDK, attribution or tracking SDK. No subscriptions, auto-renew, trials, countdowns or "limited offers".
- No mascots, confetti, XP, leaderboards. **No streak pressure** (no streak counters, flames or guilt notifications).
- **No pass guarantee or pass-rate claim**; never "pass first try", "real/actual test questions", or "Official/DMV/DPS/FMCSA" in the name or claims.
- **Never present sample content as real citations.** The mocks' content is sample; any section number like "§5.x" is a placeholder.
- No competitor banks, leaked questions or scraping; state manuals and the AAMVA model manual are paraphrased only (no 12+ word verbatim runs).
- **No secrets in the repo.** RevenueCat, PostHog, Sentry and Cloudflare keys go in EAS secrets or a git-ignored `.env`; never commit `.p8`, keystores or `google-services` credentials.
- No purchases, external accounts, posts or outreach on Sean's behalf.

## 10. Accuracy and content rules
- Every published question carries a **manual citation, a CFR reference where one applies, two verified sources, a ≤240-char paraphrase and a `last_checked` date**; CI fails otherwise (CLAUDE.md §4, §8).
- **Replace every placeholder section number from the real, current state manual** (with its edition) before anything ships. Example: the mocks' low-air fact cites 49 CFR 393.51; confirm the exact psi threshold and paragraph against the eCFR text before using it as real content [VERIFY].
- StateFormat rows ship only once verified from the primary source. Known conflict: TX Commercial Rules is 20 Q per DPS-linked material but 25 Q on a third-party site; resolve against TX DPS.
- Content you draft starts as `review_status: 'draft'`. HazMat and TX Commercial Rules are 100% human-checked by Sean; the rest is sampled at 20% with a ≤2% error bar.

## 11. What's stubbed or unknown
- **Accounts and keys:** the Apple Developer and Google Play accounts, App Store Connect records, the 7 IAPs, RevenueCat project and API keys, PostHog, Sentry and Cloudflare (Worker + D1, Pages) don't exist yet or aren't shared with you. Build behind config/env stubs and a mock purchases provider; ask Sean when you need a real key.
- **Bundle ID, privacy policy and support URLs:** not decided; ask Sean.
- **Name:** trademark clearance pending (lawyer, Sean). The quick check found no "Steady CDL" app or mark, but many "Steady" apps and marks.
- **Domains:** steadycdl.com, getsteadycdl.com and steadycdl.app were unregistered on Oct 28, 2026; none is bought.
- **Content:** no question bank exists yet (~850 Q lean target); all StateFormat rows except the sourced facts are [VERIFY]. See `docs/research/data/state-formats/state-formats-seed.csv`.

## 12. Stage gates and the kill line (CLAUDE.md §10)
- **Gate 0:** submit around day 15, only when the §12.1 pre-launch checklist is green (incl. trademark clearance). Days 22–35: lean cuts, rule-change watch, SEO pages (22–25).
- **Day 30 check:** under 10 sales, or page→install < 20%, or install→purchase < 2% → rework the listing/paywall, no new scope.
- **Gate 1:** day 30 ≥ 10 sales and days 31–60 ≥ 25 sales/mo → 51 states, more SEO, endorsement modes.
- **Kill line (day 60):** under 25 sales/mo and not rising → stop feature work, maintenance mode, rotate the engine to the next exam.
- **Gate 2:** ≥ 50/mo for 4 weeks. **Gate 3:** ≥ 80/mo for 4 weeks. A gate unlocks work; it never forces it.

## 13. Your first session
1. Read `CLAUDE.md`, then this file, then skim `docs/research/README.md` (open a report only when you need its detail).
2. Reply with a **short plan** for days 1–3 (M1 Foundations): repo layout, packages, schemas, tokens, `<Ring/>`, `<SteadyMark/>`, the question screen + autosave, CI lint, and the open questions you need Sean to answer. Wait for his OK.
3. Then create a feature branch (e.g. `feat/m1-foundations`), scaffold the Expo app and build days 1–3 in small commits with tests, and open a **pull request** with screenshots at default and largest text size and the acceptance criteria it meets.

## 14. Working conventions
- **Feature branches and PRs only;** never push to `main`. Small, focused commits with clear messages.
- Tests with every feature: Jest unit tests, snapshot tests at the largest Dynamic Type size, and the Maestro flows named in CLAUDE.md.
- **Ask Sean before changing pricing, product IDs, positioning, the approved decisions, the design system, or adding any dependency that phones home.**
- Keep all user-facing copy in `copy.ts` so the "never say" lint can run.
- When a fact isn't in these files, mark it [VERIFY] and ask; don't guess.

## 15. Reading order
1. `CLAUDE.md`, the build brief (requirements, acceptance criteria, decisions).
2. `HANDOFF.md`, this file (context and rules).
3. `docs/research/README.md`, an index of the research and data.
4. `design/png/contact-sheet-v2.png` and `design/final/steady-cdl-brand-guide.pdf`.
5. As needed: `docs/research/cdl-build-spec-v2-2026-10-28.md` (full spec), `cdl-ux-differentiation` (UX patterns), `cdl-moat` (state formats, rule-change watch), `docs/sources.md` (every source and what's unverified), `design/mobbin/references.md`.

## 16. Glossary
- **CDL / CLP:** Commercial Driver's License / Commercial Learner's Permit. The CLP requires passing the knowledge tests this app prepares for.
- **GK, Air Brakes, Combination:** the core permit knowledge tests. **TX Commercial Rules:** a Texas-only test taken first.
- **Endorsements:** **H** HazMat, **N** Tank vehicle, **T** Doubles/Triples, **P** Passenger, **S** School Bus, **X** Tank + HazMat combined (earned by passing both the H and N tests; there's no separate X unit).
- **ELDT:** Entry-Level Driver Training, the FMCSA training requirement (since Feb 2022) for new CDL, upgrade and some endorsement applicants, logged in the Training Provider Registry. We explain it; we never become a provider.
- **FMCSA:** Federal Motor Carrier Safety Administration (USDOT). **49 CFR:** the federal regulations (public domain; Parts 383, 391–397, 172 matter most). **PHMSA:** the HazMat regulator.
- **AAMVA:** the association that publishes the copyrighted model CDL manual many states adapt (paraphrase only).
- **StateFormat:** our table of each state's exact test format with sources.
- **Proof sheet:** the bottom tray after each practice answer: Correct/Not quite, the answer, why, the source and "Last checked", Read aloud, Report a mistake.
- **Cab Mode:** the inverted, audio-first, two-button listening mode ("Listen only. Don't use the screen while driving.").
- **Fix log:** the public, dated list of every content fix ("What's new and fixed", `/fixes`).
