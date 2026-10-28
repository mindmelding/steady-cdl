# Sources
Everything the research used, what each source supports, and when it was retrieved. All retrieval was read-only, on **Oct 28, 2026 (PT)** unless noted. **[VERIFY]** = not yet confirmed from the primary source; **[E]** = an estimate; **[PLACEHOLDER]** = sample or stand-in content that must be replaced.

## 1. App market data
| Source | What it supports | Retrieved | Notes |
|---|---|---|---|
| Appfigures (free tier), app profiles `https://appfigures.com/reports/app-profile/<id>`: ua_Gk7GZG, ua_RHjl8I, ua_UkxOV0, ua_rm2r0s, ua_Y6yggE, ua_uBwzPw | Revenue and download bands (Khai Vuong ~$95k/mo, Best Fun Games ~$65k, DMV Genie ~$35k iOS, BrainSoft ~$10k; Jeffrey Diaz ~45k downloads/mo), release dates, keyword crowding ("cdl practice test" 249 apps, competitiveness 54; "hazmat practice test" 247 apps, 49; "cdl pre trip" 250) | Oct 28, 2026 | **[E]** model estimates for the prior month. Reviews, listings and advertiser data were blocked (Partner API). Hanh Le's revenue was not measured |
| Appfigures `apps_search` ("Steady CDL", "Steady") | Name-conflict check: no app named Steady CDL; ~40 unrelated "Steady" apps | Oct 28, 2026 | |
| Apple App Store public pages + iTunes lookup/search API (US) | Ratings, IAP lists and prices, "Contains Advertising", descriptions for 11 iOS rivals (ids 1527903479, 1469003902, 1566343337, 1464409838, 1447415467, 1610099124, 1101536521, 1441336161, 6446039122, 6752642386, 6785859349) | Oct 28, 2026, ~9:15–9:20 AM PT | `data/pricing/ios_pricing.json`. IAP periods are often unlabeled; in-app paywalls not seen |
| Google Play via `google-play-scraper` (US) | Play ratings, installs, ads flag, IAP price ranges (12 package IDs incl. com.jeffreydiaz.android.app.cdlprep, com.bestfungames.cdl, dto.ee.cdl.genius, com.huyendt.cdl, com.brainsoft.apps.cdl, com.edupass.cdl, com.bubblingiso.CDL) | Oct 28, 2026 | `data/pricing/gp_pricing.json`. Play subscription periods not visible |
| App Store review RSS `itunes.apple.com/us/rss/customerreviews/id=<id>` | Reviews for ids 1610099124, 6446039122, 1447415467, 1101536521, 1313483156, 6752642386, then 1527903479, 1469003902, 1566343337, 1464409838, 1441336161 (up to 500 recent each) | Oct 28, 2026 | `data/reviews/` |
| Google Play reviews via `google-play-scraper` | Reviews for 7 + 4 apps (newest ≤400 + low-star pulls) | Oct 28, 2026 | Total corpus 6,112 unique reviews; 3,981 coded in `reviews_coded.csv` |
| Hand coding (356 negative reviews, 34 codes) | 343 complaints: 48% money/ads, 33% accuracy/fit, 24% reliability | Oct 28, 2026 | Directional; older apps' samples include 2021–23 reviews |
| Competitor App Store screenshots (first 3, 10 apps) | How rivals present themselves (`cdl-ux-differentiation` §8) | Oct 28, 2026 | Third-party images; **not included** in this repo |

## 2. Community signals
| Source | What it supports | Retrieved | Notes |
|---|---|---|---|
| Reddit via Apify `harshmaur/reddit-scraper` (run GRZMsXlCWVrZ64m1G; past year): r/Truckers, r/CDL, r/CDLTruckDrivers, r/cdldriver and others | 178 items: Jeffrey Diaz named in 35, CristCDL in 6, state manual in 29; hazmat/ELDT confusion (11); indie rivals ("CDL Prep Ultimate", Mar 4, 2026); ELP enforcement threads (Jan 21, 2026; Aug 2026) | Oct 28, 2026 (items from the prior 12 months) | `data/reddit/reddit_items.json` |
| Reddit, second pull (6 searches, past year) | 94 more items for the UX report | Oct 28, 2026 | `data/reddit/reddit_new.json` |
| YouTube comments via Apify `supreme_coder/youtube-comment-scraper` | 100 comments on 6 CDL app-review/HazMat videos | Oct 28, 2026 | Not included (small; summarized in `cdl-ux-differentiation` §6) |
| YouTube search page parse | Q&A video view counts (e.g. Driving Academy GK 377k; 100% DMV 766k; Apex pre-trip 8.4M) | Oct 28, 2026 | Summarized in `cdl-moat` §1, §4 |

## 3. Search demand
| Source | What it supports | Retrieved | Notes |
|---|---|---|---|
| Semrush (US), 8 + 15 keyword rows | Volumes and KD (e.g. cdl practice test 18,100 / 38; hazmat practice test 5,400 / 23; texas cdl practice test 1,000 / 13; tanker endorsement 1,000 / 15; air brakes 880 / 9; texas commercial rules test 390 / 28; dmv permit test 33,100 / 59) | Oct 28, 2026 | `data/seo/`. Monthly averages, not forecasts |

## 4. Federal rules and agencies
| Source | What it supports | Retrieved | Notes |
|---|---|---|---|
| 49 CFR (eCFR), esp. Parts 383, 391, 392, 393, 395, 396, 397, 172 | Public-domain basis for question content; Part 383 Subparts G/H (states write their own tests, ≥30 items, 80%) | Oct 28, 2026 | Paraphrase and cite every use |
| eCFR versioner API `/api/versioner/v1/versions/title-49.json?part=N` | 2026 amendment dates: 383 = 8 (last Jul 22, 2026), 172 = 7 (last Sep 8, 2026), 393 = 4, 391 = 3 | Oct 28, 2026 | `data/regulatory/ecfr_v_*.json`; the rule-change watch re-polls this daily |
| 49 CFR 393.51 (low-air warning) | Sample fact in the mocks: warning before service-tank pressure drops below 60 psi (or half the governor cut-out pressure, if lower) | — | **[VERIFY]** the exact threshold and paragraph against the eCFR text (and the state manual) before using it as real content |
| Federal Register: PHMSA HM-215R (91 FR 5996, Feb 10, 2026), HM-215S (Oct 27, 2026; comments due Dec 28, 2026) | HazMat rules are changing; log as "watching" until final | Oct 28, 2026 | |
| FMCSA ELP NPRM (Aug 10, 2026) https://www.federalregister.gov/documents/2026/08/10/2026-16288/english-language-proficiency-out-of-service-criteria | Roadside English-proficiency rules (comments closed Oct 9) | Oct 28, 2026 | |
| FMCSA ELP roadside policy MC-SEE-2026-0002 https://www.fmcsa.dot.gov/regulations/enforcement/fmcsa-elp-guidance-roadside-policy-mc-see-2026-0002 ; carrier guidance https://www.fmcsa.dot.gov/regulations/what-should-motor-carrier-do-assess-cmv-drivers-english-language-proficiency-elp-during | Roadside check format (Gate 2 "Roadside English") | Oct 28, 2026 | |
| FMCSA one-year release https://www.fmcsa.dot.gov/newsroom/trumps-transportation-secretary-sean-p-duffy-celebrates-one-year-delivering-american | 20,000+ drivers placed out of service for ELP | Oct 28, 2026 | |
| USDOT, Feb 21, 2026 https://www.transportation.gov/briefing-room/driving-news-trumps-transportation-secretary-sean-p-duffy-and-fmcsa-administrator | National English-only CDL testing push | Oct 28, 2026 | No federal final rule found |
| FMCSA Training Provider Registry https://tpr.fmcsa.dot.gov/ | ELDT: 32,549 trained Sep 2026; 2,061,068 since Feb 2022; 18,341 active providers | Oct 28, 2026 | Buyer-pool estimate (~390k/yr) is **[E]** |
| FMCSA non-domiciled CDL rule FAQs https://www.fmcsa.dot.gov/regulations/non-domiciled-cdl-2026-final-rule-faqs ; FreightWaves https://www.freightwaves.com/news/request-to-block-non-domiciled-cdl-rule-denied-case-heads-to-court | Effective Mar 16, 2026; ~194k affected (petitioners' figure) | Oct 28, 2026 | Litigation pending |
| BLS OOH https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm | 2,235,100 drivers (2024); 237,600 openings/yr (2024–34) | Oct 28, 2026 | |
| TSA HME pages; MO DOR HME FAQ; LA OMV renewal | HazMat renewal/retest varies by state; TSA threat assessment every 5 years | Oct 28, 2026 | Gate 1 endorsement modes |

## 5. State CDL rules and manuals
| Source | What it supports | Retrieved | Notes |
|---|---|---|---|
| Texas DPS https://www.dps.texas.gov/news/dps-announces-changes-cdl-knowledge-testing ; TX DPS CDL apply page; 5-Star CLP packet; 37 TAC §16.27 | TX English-only since Jun 1, 2026 (no interpreters, Spanish dropped); Commercial Rules 20 Q / 80%, taken first | Oct 28, 2026 | **[VERIFY]** 20 vs 25 Q (cdlpracticetest.com says 25) |
| TX CDL Handbook | Lesson and question citations | — | **[PLACEHOLDER]** every "§5.x"-style number in the mocks; download the current edition and cite real sections |
| CA DMV CDL knowledge test evaluation report | CA GK 50 Q, 10 misses allowed | Oct 28, 2026 | **[VERIFY]** against the CA DMV handbook |
| CDLLife (2026) | FL English-only for all license exams since Feb 6, 2026 | Oct 28, 2026 | Secondary source; **[VERIFY]** with FLHSMV |
| Zutobi state list https://zutobi.com/us/driver-guides/2026-dmv-rules-test-updates-cdl ; cdlpracticepro.com English-only list | UT (Jan 20, 2026), OR, DC English-only | Oct 28, 2026 | Secondary; **[VERIFY]** per state |
| NY CDL-10 manual §1.4.1; Iowa DOT CDL testing; driving-tests.org | NY and IA use 3 answer choices; IA GK 50 Q, pass 40 | Oct 28, 2026 | Gate 1 rows; **[VERIFY]** |
| AAMVA CDL testing page; Oregon DMV bulletin; ALEA; Maine SOS | Modernized manual/test rollout dates (OR Oct 1, 2025; AL Jul 1, 2025; ME Nov 1, 2026 / Sep 1, 2027) | Oct 28, 2026 | **[VERIFY]** |
| AAMVA model manual copyright notice (via Indiana BMV PDF) https://www.in.gov/bmv/files/CDL-Manual.pdf | AAMVA text is copyrighted: paraphrase only | Oct 28, 2026 | |
| FL FLHSMV, CA DMV, TX DPS manuals and CDL pages | Manual hashes for the rule-change watch | — | URLs to be added on Day 1–2 **[VERIFY]** |

## 6. Other industry sources
- ELDT course prices: https://eldt.io/, https://eldt365.com/eldt-training-cost ($15–$20 online theory). Oct 28, 2026.
- Aurora driverless routes: https://ir.aurora.tech/news-events/press-releases/detail/132/aurora-triples-driverless-network-to-10-routes-and-prepares-to-expand-across-u-s-sun-belt. Oct 28, 2026.
- IIR/GMU "Immigrant Truck Drivers" 2022 (ACS 2018–22 via IPUMS): 18% of truck drivers foreign-born; also NATSO. Oct 28, 2026.
- retrainingreport.com (WIOA PY2024: 40% of 162k funded trainees were CDL); TTNews (28k revoked). Oct 28, 2026.
- DMV Genie premium and terms pages (pass guarantee; Apple handles IAP refunds). Oct 28, 2026.

## 7. Design references
- Mobbin (iOS screens): 15 lessons-style references + 14 earlier UX references, all with links in `design/mobbin/references.md`. Retrieved Oct 28, 2026. Internal reference only; images not included.
- Fonts: Atkinson Hyperlegible, Inter, IBM Plex Mono (open-source font licenses) [VERIFY the license text ships with the app].

## 8. Name and domain checks (Oct 28, 2026, ~11:05 AM PT)
- Trademarks (via Trademarkia, Furm, uspto.report, TTABVUE; USPTO's own search didn't load): no "STEADY CDL" mark found. Live "STEADY" marks include Reg. 7351143 (STEADY, LLC; class 41, soccer and college counseling) and Reg. 6473728 (Steady Media GmbH; goods not checked). Serial 87904026 (Steady Platform; job-matching apps) is abandoned. **A lawyer's clearance is a pre-launch gate** (Decision 6).
- Domains (registry RDAP: Verisign for .com, Google Registry for .app): steadycdl.com, getsteadycdl.com, steadycdl.app returned "not found" = unregistered at the time. Nothing purchased; premium pricing not checked.

## 9. Sample and placeholder content (must not ship as real)
- All content in `design/png/` and `design/store/` is **sample content**. Manual section numbers like "TX CDL Manual §5.x" are **[PLACEHOLDER]**; the "Last checked Oct 2026" lines and "Source: TX DPS · checked Oct 2026" are mock labels, not verified checks.
- Mock readiness scores, minutes, question counts and dates (e.g. "Nov 18 · 21 days", "78 ready") are illustrative.
