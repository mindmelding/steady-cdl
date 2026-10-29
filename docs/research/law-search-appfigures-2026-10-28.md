---
title: "Appfigures re-check + law-driven idea search"
---

# Appfigures re-check of current ideas + law/mandate-driven idea search (Oct 28, 2026)

*Prepared Wed Oct 28, 2026, late morning PT. Sources: the Appfigures connector (free tier), Semrush (US + DE databases), state/federal agency pages, takeseffect.com, news. Read-only: nothing was posted, signed up for, bought or contacted. **[J]** = judgment. **[est]** = estimate. Raw data: `law-search-2026-10-28/`. Model: `model/law_search_run.py`, `model/law_search_log.txt`.*

## 0. What the Appfigures free tier can and can't show (read this first)

- **Available:** `apps_search` returns, per app, Appfigures' modeled **net** revenue and downloads for the **previous calendar month (Sep 2026), worldwide**, in coarse buckets. The lowest revenue bucket is **"≤ $5k"**; above that we get rounded figures ($10k, $25k, $35k…). Many apps show **no estimate at all** (treated here as "not shown", not as $0). Keyword tools (`keywords_rankingApps`) also work: App Store popularity/competitiveness and how many apps rank.
- **Locked (403):** per-app monthly time series (`metrics_query` → "unlock estimates"), and the catalog explorer/aggregations ("Partner API Access"). So **no revenue trend lines and no $1k/mo threshold counts** were possible. "Comparable revenue not falling" could not be tested from Appfigures; trend notes below come from Semrush or earlier TrustMRR reads.
- Net revenue ≈ gross × 0.7 (Appfigures' own note), so TrustMRR MRR figures (gross) read ~30% higher than Appfigures for the same app.

## 1. Result in brief

| Idea | Appfigures (Sep 2026, net, worldwide) | Crowding rule (≤3 dedicated, no official app, comparable not falling) | Verdict |
|---|---|---|---|
| **C. CA RBS (underserved languages) + TX Twogether** | No dedicated alcohol-server or premarital-course apps earning anything visible (searches "alcohol server", "premarital", "food handler" return trackers, delivery and couple-quiz apps, all ≤$5k or no estimate) | App-store version: passes trivially. The real crowding check stays the ABC RBS portal (68 online programs; none listed in Hindi, Punjabi or Tagalog as of Dec 2025) | **Unchanged: stays.** Appfigures adds nothing either way; it's a web/approval play |
| **Part 107 exam prep** | **No dedicated Part 107 app shows an estimate.** Best visible: ASA "Prepware Remote Pilot" **≤ $5k**. | **Fails.** "part 107" keyword: **131 iOS apps rank** (popularity 23, competitiveness 60); 13 of the top 15 are dedicated prep apps, 9 of them with store IDs in the range that spot-checked as 2025–26 listings | **Drop from the head of the queue.** Demand is real (Semrush 4,400/mo), money isn't |
| **CDL exam prep** | **Khai Vuong CDL Prep $95k; Best Fun Games CDL Prep $65k; DMV Genie CDL $35k; BrainSoft "CDL Prep – Practice Test 2026" $10k.** 4 of 62 dedicated CDL apps (6.5%) at ≥$10k | **Fails ≤3** ("cdl practice test": 249 apps rank, competitiveness 54) **but comparable revenue is strong** and a recent entrant (BrainSoft, 2025–26 ID) reaches $10k | **Keep as #1 app bet**, framed as "crowded but paying". Wedge: English-only CDL knowledge tests (TX, FL, UT, OR, DC, see §3) |
| **#76 German werewolf narrator test** | No German narrator shows more than ≤$5k; Wolvesville leads | **Fails.** ≥7 narrator/moderator apps targeting Germany: Werwolf – Spielleiter (released **Oct 7, 2026**), Werwolf Gamemaster/7wolf (Mar 2025), Werwolf Multiplayer, Werwolf Hunt, Werwolf Helfer, Werwolf Moderator, Werewolf – Narrator. DE App Store "werwolf": competitiveness **92**, popularity 6 | **Kill the test.** Germany filled in 2026 |
| **Faith app slot (vs Bibly)** | Five different apps named "Bibly" (all 2025–26, all ≤$5k or none), incl. the French "Bibly – Versets et motivation" ≤$5k (consistent with TrustMRR $4.9k gross MRR). Money sits with incumbents: Hallow ~$1M, Dwell $220k, Abide $140k, Glorify $100k, Logos $95k, Life Bible $65k, Bible Gateway $30k | **Fails** (incumbent-dominated; name clones) | **No slot.** |
| **#75 scan-and-value** | Card scanners pay, including new entrants: **MonPrice $80k, Cardstock $45k, Card Value Scanner for Pokemon $30k, Shiny $25k, Pokechart $25k, Sports Card Value Scanner $10k, Card Identifier $10k.** 6 of 10 dedicated TCG/sports-card scanners in the sample ≥$10k | **Fails ≤3**, but proves the category still pays 2024+ entrants | Hot Wheels / pins stay dropped. A card-scanner entry is a "crowded-but-paying" bet like CDL, needs a specific wedge [J] |

**Plain read:** Appfigures flips the morning's app-queue logic. The "empty" niches we liked (Part 107, German narrator, faith utilities) **have no visible earners**; the crowded ones (CDL, card scanners) **pay several apps, including recent entrants**. The ≤3-dedicated-apps rule would have kept the empty-but-unpaid niches and rejected the paying ones.

**Recommended rule change (crowding re-check v2):** before any build, require **either** (a) ≥2 apps listed since 2024 showing ≥$10k/mo in Appfigures, plus a named wedge; **or** (b) ≤3 dedicated apps **and** at least one comparable with verified revenue (TrustMRR/RevenueCat). "Empty niche, no earners" no longer counts as a pass.

## 2. App hit rate: what the data supports

The plan's hit rate (pf = pl = .12) is the chance an app nets ≥$1k/mo by Apr 2028. The free tier can't count apps at $1k, but it can count apps at ≥$10k, and the model makes a testable prediction there:

| Model hit rate | Implied median app | Implied share of apps at ≥$5k | at ≥$10k |
|---|---:|---:|---:|
| .10 | $60/mo | 2.2% | 1.0% |
| **.12** | $75/mo | 2.8% | **1.3%** |
| .14 | $93/mo | 3.5% | 1.7% |

Observed (Sep 2026, Appfigures, net):

| Niche | Denominator | ≥$10k | Share |
|---|---|---:|---:|
| CDL prep, dedicated apps in search | 62 | 4 | 6.5% (search-ranked, survivor-biased) |
| CDL prep, all apps ranking for "cdl practice test" | 249 | 4–5 | **≈1.6–2.0%** |
| Part 107, all apps ranking for "part 107" | 131 | 0 | **0%** |
| Tip trackers, all apps ranking for "tip tracker" | 247 | 1 (ServerLife $35k) | **0.4%** |
| German werewolf, apps ranking for "werwolf" (DE) | 199 | 0 dedicated narrators | **0%** |
| Exam prep, "practice test"/"exam prep" searches, dedicated | 159 | 14 | 8.8% (survivor-biased) |

**Read [J]:** with full-keyword denominators, paying niches land at ~1.6–2.0% ≥$10k, at or slightly above the model's 1.3%. Empty niches land at 0%. So the data **supports keeping .12 only if the queue is aimed at niches with proven earners** (CDL-type), and supports **.11 or lower if Part 107 / German narrator / faith stay in the queue**. It does not justify raising the rate. The $1k threshold itself remains untested (needs the paid tier or our own launches).

## 3. Law-, license- and deadline-driven search

**Method.** takeseffect.com (830 upcoming CA + federal changes), NCSL-style state searches, Federal Register, agency pages (FMCSA, Texas DPS, FLHSMV, NJ MVC, SCDOR, Florida DBPR, EPA, CMS, IRS, FAA, German BMV), news. Each candidate checked for: forced buyer pool, search demand (Semrush), competitors and their revenue (Appfigures for apps), approval lead time, 14-day validation / 21-day ship, and kill rules (sales work, services, slow approval, crowding).

**Bottom line: no new law-driven idea clears the bar or beats a weaker plan part.** The closest misses are below, ranked.

### 3.1 Closest misses

| # | Mandate (status) | Forced buyer pool | Demand (Semrush US/mo, KD) | Competitors / revenue | Timeline | Why it misses |
|---|---|---|---|---|---|---|
| 1 | **EPA Section 608 exam revised Jan 1, 2027** to add A2L/A3 refrigerants (R-32, R-454B); no new cert type; existing certs don't expire | New HVAC/appliance techs who must pass 608 to buy/handle refrigerant (annual count not found [open]) | "epa 608 practice test" **4,400, KD 14** (stable, peaked recently); "epa 608 certification" **40,500, KD 54**, spiking from 0.04 to 1.00 since ~May 2026 | ~15 dedicated 608 apps; **only SkillCat shows revenue ($210k/mo)**, and SkillCat gives the certification test free (employer/recruiting-funded). Every other 608 prep app: no estimate | No state approval for prep; shippable in 21 days | **Comparable fails:** independent prep apps show no money, and the leader's free model caps price. Best use: an SEO page/question-bank update inside an existing exam-prep app, not a line |
| 2 | **New Jersey e-bike license** (P.L.2025 c.285; licensing began **Jun 26, 2026**): riders ≥15 without a driver's license must pass a **knowledge + vision test**, then a road test | NJ e-bike riders aged 15–16 plus adults without a DL (no official count found; NJ has two 15–16 cohorts of roughly 110–120k each [est, Census-scale]) | "nj ebike license" 50, "ebike license nj" 50 (KD 28), "nj e bike license" 40; "new jersey ebike law" 480 (spiked at passage, now 0.02 of peak). App Store "ebike test": no data | **No dedicated NJ e-bike test app found.** Closest comparable: Swiss moped/e-bike theory app iTheorie Mofa **$10k/mo** | No approval; 14-day ASO test possible; 2-day build from the NJ E-bike & Moped Manual | **Too small:** one state, ~150 searches/mo. Ceiling likely $1–3k/mo [J]. Fine as a 2-day micro-app if the queue has a spare slot; not a plan part. No other state has copied the knowledge test (Utah: online safety certificate for ages 8–15 only, official course; Illinois 2027: age limits only) |
| 3 | **English-only CDL knowledge tests:** Texas from **Jun 1, 2026**, Florida from **Feb 6, 2026**, Utah, Oregon, DC; USDOT announced a national push **Feb 21, 2026** (no final rule found) | Spanish-dominant CDL applicants in those states (no official count found) | "cdl en español" 390 **falling (0.31 → 0.08)**; "cdl english proficiency test" 90 falling; "cdl test in spanish" 20 | Spanish CDL apps exist ("Conocimientos Clase CDL", "CDL USA Español 2026"); Texas DPS gives the English handbook free | — | **Not a separate line.** Demand for Spanish CDL content is collapsing, not shifting. Use only as positioning for the CDL app ("pass the English-only test") |

### 3.2 Killed

| Mandate | Key numbers | Kill reason |
|---|---|---|
| **No tax on tips** (OBBBA; deduction 2025–2028; final IRS occupation list effective **Jun 12, 2026**; IRS says keep daily tip logs) | "no tax on tips" 33,100/mo, KD 67 (news-driven, now 0.02 of peak); "tip tracker app" 70 | **Crowded:** 247 apps rank for "tip tracker"; **≥9 new tip trackers in 2025–26** (TipKeepr, Tip Tally, TipOut, TipThat, TipGenie, Tiplo, Tillside, Tipped, Waiter Pal). Only ServerLife earns ($35k); all others ≤$5k or none |
| **Medicaid work requirements** (HR 1; states by **Jan 1, 2027**; 80 hrs/mo or $580/mo income) | ~18M+ expansion adults [est, widely reported] | States must use data matching first; self-attestation allowed in 2027; CMS offers the free Emmy app; low-income buyers. Low willingness to pay |
| **FAA Part 108 (BVLOS)** | Final rule at OIRA since Jul 10, 2026, not published | **No FAA test or certificate** for operations supervisors or flight coordinators; training is operator-run. Nothing forced on individuals |
| **South Carolina H.3430 alcohol-server training** (deadline **May 1, 2026**; then within 30 days of hire; online-only with proctored exam) | "sc alcohol server training" 90/mo (spike passed) | **11 approved programs** already, incl. ServSafe, 360training, LIQUORexam; 60-day SCDOR review. Small and crowded. (Same model as C, so not needed) |
| **Florida condo + HOA director certification** (within 90 days of election; HOA 4–8 CE hrs/yr) | "florida hoa board certification" 40/mo; condo 40/mo | Tiny search; DBPR approved-provider list (Aug 24, 2026) already long; buyers are boards (sales) |
| **Washington ESHB 1878** (driver training mandatory for 18-year-olds from **Jan 1, 2027**, rising to 21) | Large cohort | Requires licensed driving school incl. behind-the-wheel (a service); online self-paced rules not yet written; DOL can delay |
| **Germany: new theory question catalog (~840 questions) from Jul 1, 2027**; digital theory lessons allowed from Jan 1, 2027 | DE "führerschein theorie app" 880/mo, KD 49, rising | Strong incumbents; the official question catalog is licensed [verify]; only ~9 months of revenue before Apr 2028 |
| **CA AB 1977** (renewing notaries must pass the state exam, **Jan 1, 2027**) | — | Existing notary-prep market; a tweak to an old requirement |
| **CA youth-sports CPR/AED (Nevaeh Act, Jan 1, 2027)**; **CA AB 2150 naloxone video (Jan 1, 2027)** | — | Accredited CPR orgs only; naloxone video is EMSA-approved and employer-paid (B2B) |
| **ELDT theory (FMCSA, TPR crackdown 2026)** | "eldt theory course" 320/mo, KD 37 | Crowded incumbent providers [not fully checked]; per-student TPR reporting is ongoing ops work |

**Honest conclusion:** mandate-driven demand in 2026–27 is either (a) captured by free official channels, (b) flooded within months (tips), (c) aimed at businesses (sales), or (d) too small. Nothing found beats C, which already is the best mandate play in the plan.

## 4. Odds (same engine: replace_sim, reading i, N = 200,000, seed 1027; m18 = Apr 2028, $12.5k/mo)

No new line is added, because nothing passed. Only the app hit rate moves, informed by §2.

| Scenario (C replaces CAL, C re-scoped; morning scenario B inputs) | m12 base / pess | **m18 base / pess** |
|---|---|---|
| Hit rate .12: queue re-aimed to niches with proven earners (CDL first; Part 107, German narrator and faith dropped) | 67.1 / 61.4 | **81.3 / 77.5** |
| Hit rate .11: Part 107 / German narrator / faith kept in the queue | 65.5 / 59.8 | **80.1 / 76.1** |
| Hit rate .10: queue keeps empty-but-unpaid niches | 63.7 / 58.0 | 78.8 / 74.7 |
| Hit rate .13: sensitivity only, not claimed | 68.7 / 63.1 | 82.4 / 78.7 |

- **Updated estimate: 81.3 / 77.5 if the queue is re-aimed today; 80.1 / 76.1 if it isn't.** Same as this morning's numbers. Appfigures now gives a data reason for choosing which.
- **Still not 90%.** The route remains the Jul 2027 apps milestone (≥ $1.5k/mo combined → ~90.8% conditional).

## 5. Recommended plan changes (Sean decides)

1. **App queue order:** CDL (English-only-test angle) first; a card-scanner entry only if it has a named wedge; Part 107 → bench (ASO-only if a slot is idle); **kill** the German narrator test and the faith slot.
2. **Replace the ≤3-apps crowding rule** with crowding re-check v2 (§1).
3. **C unchanged.** Keep the RBS portal check and the Twogether curriculum check as the 14-day gate.
4. **Optional 2-day micro-apps (not in odds):** NJ e-bike knowledge test; EPA 608 2027 question-bank update inside the exam-prep app.

## 6. Tool spend

| Tool | Used |
|---|---|
| Semrush | **210 API units**: 27 keywords requested, 21 rows returned (US 19, DE 2) |
| Appfigures | Free tier, ~40 calls (search, keyword ranks, app records). Per-app metrics and explorer returned 403 (paid/partner only) |
| Treg | **$0** (not needed; Semrush trend columns covered it) |
| Apify | **$0** |

## 7. Sources (read Oct 28, 2026)

**Appfigures** (app profiles: `https://appfigures.com/reports/app-profile/<id>`): CDL Prep Test 2025 (ua_Gk7GZG), CDL Prep Practice Test 2025 (ua_RHjl8I), CDL Prep Test DMV Genie (ua_UkxOV0), Prepware Remote Pilot (ua_ySCC73), FAA PART 107 Practice Test (ua_Punk1G), Werwolf – Spielleiter (ua_HMr2It), 7wolf (ua_pA5dHf), SkillCat (ua_HZCkmW), ServerLife (ua_KGIKZ5), iTheorie Mofa (ua_nOQE0q), Trading Card Scanner MonPrice, Cardstock (ua_RgAOZ6), Hallow (ua_3TU5Lq). Raw search output and tallies: `law-search-2026-10-28/appfigures/`.

**Semrush:** `law-search-2026-10-28/semrush_us_law_batch.csv`.

**Laws and agencies**
- Texas DPS, English-only CDL knowledge tests (Jun 1, 2026): <https://www.dps.texas.gov/news/dps-announces-changes-cdl-knowledge-testing>
- Bay County FL tax collector (FLHSMV English-only from Feb 6, 2026): <https://baycountyfltax.gov/licenses-permits/commercial-driver-license/>
- USDOT, Feb 21, 2026 announcement: <https://www.transportation.gov/briefing-room/driving-news-trumps-transportation-secretary-sean-p-duffy-and-fmcsa-administrator>
- State list snapshot: <https://cdlpracticepro.com/cdl-test-english-only-states>
- IRS no-tax-on-tips final regs and records: <https://www.irs.gov/newsroom/treasury-irs-issue-final-regulations-listing-occupations-where-workers-customarily-and-regularly-receive-tips-under-the-one-big-beautiful-bill>, <https://www.irs.gov/newsroom/what-you-will-need-to-file-your-taxes-under-working-families-tax-cuts>, Federal Register 2026-07104
- FAA Part 108 status and roles: <https://droneauthority.org/laws/part-108>, <https://www.flyusi.org/guides/get-108-ready>, <https://www.faa.gov/newsroom/fact_sheets/Fact_Sheet_BVLOS.pdf>
- Medicaid work requirements: <https://www.chcs.org/resource/a-summary-of-national-medicaid-work-requirements/>, <https://www.cbpp.org/research/health/a-guide-to-reducing-coverage-losses-through-effective-implementation-of-medicaids>, <https://www.cms.gov/medicaid-chip/community-engagement-support/eligibility-made-easy>
- NJ e-bike licensing: <https://www.nj.gov/mvc/press/archives/2026/062326.htm>, <https://www.nj.gov/mvc/vehicletopics/ebike.htm>
- Other e-bike laws: <https://myebikelaw.com/>, <https://reallawgroup.com/resources/illinois-e-bike-law>
- EPA 608 exam changes: <https://www.epa.gov/section608/section-608-technician-certification-requirements>, <https://www.achrnews.com/articles/166686-what-you-need-to-know-about-the-new-section-608-exam>
- SC H.3430: <https://www.dor.sc.gov/alcohol-beverage-licensing-abl/recognized-training-programs>, <https://www.scrla.org/page/LL>
- Florida DBPR board certification: <https://condos.myfloridalicense.com/education/>, <https://www.flsenate.gov/Laws/Statutes/2026/720.3033>
- Washington ESHB 1878 report: <https://dol.wa.gov/media/pdf/5170/2025-expanded-driver-education-requirements-implementation-reportpdf/download?inline=>
- Germany driver-training reform: <https://www.bmv.de/SharedDocs/DE/Pressemitteilungen/2026/043-schnieder-bezahlbarer-fuehrerschein.html>, <https://fahratlas.de/fuehrerschein/reform-2027>
- takeseffect.com: CA AB 1977, AB 2150, SB 412 pages; Nevaeh Act: <https://www.calnorth.org/aed>

**Model:** `model/law_search_run.py`, `model/law_search_log.txt`.
