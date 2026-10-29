# CDL exam prep: can we stand out, and what should we build?
*Research date: Oct 28, 2026. All research was read-only. **[E]** marks an estimate or inference. Everything else comes from a source listed in §9. Raw data is in `cdl-2026-10-28/`.*

## 0. Verdict
**Yes, we can stand out, but the English-only test can't be the main pitch.** The biggest opening the reviews show is **trust**: honest pricing, no ads, and questions that are current, correct and match the state's test, including endorsements. The English-only and roadside English angle works as a **positioning line plus a small bundled module**. It doesn't hold up as a product of its own:

- Searches for "english proficiency test for truck drivers" run about **110 a month and are falling**.
- At least **5 standalone "trucker English" apps** launched between Jul 2025 and Oct 2026. None has more than **7 ratings**.

**Keep CDL as the #1 app bet, but don't raise the hit rate.** Crowding is speeding up. Most of the top App Store results for "hazmat practice test" and "cdl pre trip" look like 2025–26 launches **[E]**. A clone with no angle of its own won't make money, so the angle has to show on the first screen and in the first review.

## 1. What we pulled
| Source | Volume | Notes |
|---|---|---|
| Apple App Store reviews (public RSS, US) | 1,727 | 6 apps with reviews (BrainSoft's iOS app and Iteration's iOS app returned none), up to 500 most recent per app |
| Google Play reviews (`google-play-scraper`, US) | 2,254 | 7 apps: newest ≤400 per app, plus 472 extra 1–3★ reviews |
| **Total reviews** | **3,981** | **2,064 from 2025–26.** Of those, **581 are 1–3★** and **1,483 are 4–5★** |
| Reddit posts and comments (Apify `harshmaur/reddit-scraper`) | 178 | r/Truckers, r/CDL, r/CDLTruckDrivers, r/cdldriver and others, past year |
| Store listings and prices | 7 iOS listings, 7 Play listings | iTunes lookup API, App Store pages, Play metadata |
| Appfigures (free tier) | — | Revenue and download bands, release dates, keyword crowding. Reviews, listings and advertiser data need Partner API access, so they were blocked. |
| Semrush | 8 keyword rows | 80 API units |

**Apps covered:**

| App | Revenue/mo (Appfigures) | Launched | Model and ratings |
|---|---|---|---|
| Khai Vuong "CDL Prep Test 2026" | **~$95k** | iOS 2022 | 4.7★ on 7.8k iOS ratings |
| Best Fun Games "CDL Prep – Practice Test 2026" | **~$65k** | 2023 | 4.6★ iOS |
| DMV Genie (Elegant eLearning) | **~$35k** (iOS) | 2019 | 4.8★ on 14.5k iOS ratings |
| BrainSoft / Genioworks "CDL Prep – Practice Test 2026" | **~$10k** | Play Jun 2026, iOS Oct 2026 | — |
| Jeffrey Diaz "CDL Prep" | ~45k downloads/mo; no revenue estimate, since it is ad-funded | — | Free, 4.7★ on 7.0k iOS ratings; 1M+ Play installs |
| Iteration Mobile | — | — | — |
| HLT "Official CDL Test Prep" | — | — | Partnered with Iowa DOT and AAMVA |
| Solvely "CDL PassFast" | No revenue shown | Oct 2025 | 2.5k ratings in 1 year |

How the reviews were coded: keyword rules in `code_themes.py`. One review can count toward several themes. These are directional counts, and they undercount "not on the real test" complaints because people word them in many ways.

## 2. What drivers hate (2025–26 reviews, 1–3★, n = 581)
| Theme | Reviews | Share | Where it concentrates |
|---|---|---|---|
| **Monetization traps** (paywall or price, can't cancel or still billed, "free" bait, lost lifetime access, rating nags) | **194** | **33%** | Best Fun Games, Khai Vuong, DMV Genie, Solvely |
| …paywall or price | 115 | 20% | |
| …can't cancel or still charged or refused refund | 75 | 13% | |
| …"free" trial bait or "scam" | 41 | 7% | |
| **Ads** (every 2–10 questions, can't close, block the results screen) | **95** | **16%** | 73 of 95 are Jeffrey Diaz, the free market leader |
| **Content quality** (wrong answers, not on the real test, repeats, confusing wording) | **106** | **18%** | All apps |
| **Coverage gaps** (endorsement or state) | **80** | **14%** | Hazmat, passenger, doubles/triples, air brakes; TX, IL, VA, WA, SC, NJ, CT |
| Bugs, crashes, lost progress | 26 | 4.5% | Mostly Best Fun Games after payment |
| Forced ELDT or certificate upsell, no endorsement-only path | 9 | 1.5% | DMV Genie |
| Spanish or language requests | 9 recent (all stars) | — | Khai Vuong, Jeffrey Diaz |
| Audio or hands-free requests | 2 | — | Rare in reviews |

**Specific asks counted in 2025–26 reviews:**
- **"Let me pay to remove ads"**: 12 reviews, all on the free leader, which has no remove-ads purchase.
- **Hazmat renewal or retest**: 23.
- **"I only need one endorsement"**: 5.
- **Texas Commercial Rules test missing**: 2.
- **"5 stars to remove ads" schemes**: 7. These breach store review rules and inflate the leaders' ratings.

**Representative quotes:**
- *"Still charging me, this app gives you no way of cancelling and I emailed them with no response."* (Best Fun Games, Play, Nov 23, 2025, 1★)
- *"App says 'Take a free test' click on it and immediately forces you to pay 25 bucks a month just to take a test."* (Best Fun Games, Play, Jun 23, 2026, 1★)
- *"I paid over $100 for lifetime access, and now they've locked me out and replaced it with a new subscription plan."* (DMV Genie, Play, Jul 16, 2025, 1★)
- *"I'd pay to remove the ads, but there is no option for that. Otherwise this app is very useful."* (Jeffrey Diaz CDL Prep, Play, Apr 12, 2026, 4★)
- *"I took the practice exam and at the end you can go over the questions you get wrong but then the ad pops up and it won't let you go over the exam."* (Jeffrey Diaz CDL Prep, iOS, Oct 8, 2026, 2★)
- *"Several questions in the pool will mark your answer incorrect then proceed to explain the reasons the answer is correct."* (Jeffrey Diaz CDL Prep, iOS, May 23, 2026, 2★)
- *"With hazmat more than half of the questions that were on the test weren't in the app."* (Jeffrey Diaz CDL Prep, iOS, Jun 1, 2026, 3★)
- *"Completely leaves out the Commercial Rules test that is required prior to taking any of these tests at Texas DPS."* (Jeffrey Diaz CDL Prep, Play, Aug 25, 2026, 3★)
- *"I selected South Carolina, yet the app repeatedly gives questions that reference other states."* (Khai Vuong, iOS, Aug 28, 2026, 1★)

## 3. What drivers love (2025–26 reviews, 4–5★, n = 1,483)
| Theme | Reviews | Share |
|---|---|---|
| "Passed" | 418 | 28% |
| Endorsement named (hazmat, tanker, air brakes and so on) | 203 | 14% |
| **Matches the real test ("word for word", "exact", "accurate")** | **156** | **10.5%** |
| First try | 119 | 8% |
| Easy or simple | 105 | 7% |
| Study modes (flashcards, exam mode, missed questions) | 70 | 4.7% |
| Explanations or manual-section references | 62 | 4.2% |
| Free | 52 | 3.5% |
| Fast (days or hours) | 47 | 3.2% |
| Worth paying | 35 | 2.4% |

- *"About 98% accurate. All the questions for the general knowledge, tanks, and air brakes were literally word for word on the CA dmv written test."* (Jeffrey Diaz, iOS, Nov 25, 2025, 5★)
- *"I love how if you get an answer wrong, it shows you the correct answer and why."* (DMV Genie, iOS, Sep 28, 2026, 5★)
- *"It could use headphones mode to be able to listen to help with learning."* (Jeffrey Diaz, Play, Jul 10, 2026, 5★)

**How the market works [E]:** the most loved and most recommended app is the **free** one. Reddit names Jeffrey Diaz "CDL Prep" in **35 of 178** items ("the steering wheel one"), and **CristCDL.com** in 6. The money goes to subscription apps that show poor recent reviews:
- Khai Vuong has **63** recent 1–3★ reviews against **40** recent 4–5★ in our sample, yet earns ~$95k/mo. That points to paid acquisition, review prompts or both, but we couldn't verify it because the advertiser data is behind Partner access.

**So there's room for an app that is as accurate and well-liked as the free leader but charges a fair one-time price.**

## 4. Reddit and forums (178 items, past year)
- **Main study path:** the free CDL Prep app, plus CristCDL.com, plus the state manual (29 mentions). People ask "is the app enough?" and "which app for hazmat?" again and again.
- **Hazmat confusion is common:** 11 items about ELDT and hazmat. People ask whether they need ELDT again or what the TSA steps are. One Jul 10, 2026 post says the **2026 hazmat questions changed** and that the free app is "now pretty much obsolete".
- **Indie builders are already pitching r/cdldriver:**
  - "CDL Prep Ultimate" (Mar 2026) claims no ads, 2,900+ questions and 500 free premium codes.
  - Another CDL driver is building a permit and pre-trip app and asking for testers.
  - A $20 hazmat ELDT course is being promoted.
- **English-proficiency enforcement is a big talking point.** In r/Truckers, a Jan 2026 post pulled **56k ELP violations** and an Aug 2026 post on 110 schools shut drew about 300 upvotes. The talk is about enforcement on the road, not about studying. That fits the weak search demand.

## 5. Industry trends to build in
| Trend | Fact (source) | Build implication |
|---|---|---|
| **English-only knowledge tests** | **FL from Feb 6, 2026; TX from Jun 1, 2026 (DPS: no interpreters; Spanish discontinued); UT from Jan 20, 2026.** USDOT announced English-only CDL tests on Feb 21, 2026. **No federal final rule found** as of today. | English-only practice everywhere. Plain-English mode, a tap-to-define trucking glossary, and audio read-aloud. Don't lead with Spanish test prep; "cdl en español" demand is falling (prior run). |
| **ELP roadside enforcement** | Out-of-service enforcement since Jun 2025. FMCSA says 20,000+ drivers placed out of service. CVSA criteria revised Apr 19, 2026. FMCSA ELP NPRM Aug 10, 2026 (comments closed Oct 9). The roadside check has 2 steps: an English interview covering trip origin and destination, hours of service, license, shipping papers and equipment; then MUTCD and message-sign recognition. | A small bundled "Roadside English" module: practice for the 5 interview topics with speech recognition, plus a MUTCD sign quiz (federal, public domain). Use it to position the app, not as a separate app (§0). |
| **ELDT and the Training Provider Registry** | **32,549 drivers trained in Sep 2026; 2,061,068 since Feb 2022.** 18,341 active providers; 9,963 locations removed. Online theory courses go for **$15–$20** (ELDT.IO, ELDT365, DLA). | Every new CDL and hazmat applicant passes through ELDT, so that's the buyer pool. **Don't become an ELDT provider.** It's a registered training-provider business with a $15–$20 price race and compliance overhead, close to a service. Do explain ELDT clearly (the hazmat ELDT confusion). |
| **Non-domiciled CDL rule** | Final rule effective Mar 16, 2026. Only H-2A, H-2B and E-2 qualify; EADs are no longer accepted. D.C. Circuit heard merits arguments Sep 15, 2026; no ruling yet. About 194,000 drivers affected (FreightWaves, citing petitioners). | Slightly shrinks the pool of new non-citizen entrants. Our core buyer is a domestic first-time CLP candidate, so this changes little. |
| **School and provider crackdown** | 110 schools shut over ELP (Aug 2026). More than 6,800 providers removed (FMCSA). | Self-study demand rises if schools get scarcer **[E]**. |
| **Driver demand** | BLS: **2,235,100** heavy-truck drivers in 2024 and **237,600 openings a year** (2024–34), the most of any non-degree occupation. | Steady inflow of new test-takers. |
| **Autonomous trucks** | Aurora runs 12 driverless routes in the Sun Belt and plans 200+ trucks by the end of 2026. | Negligible against 2.2M drivers over our 18-month window. |
| **AI tutors and voice** | DMV Genie has an AI helper ("AI would freeze" review). Solvely offers audio and Spanish, but is criticized for repeated AI-made questions. One low-star review calls Best Fun Games "AI trash" and its AI art "misleading". | Use AI behind the scenes for explanations grounded in the manual, with a human check. **Never show AI art.** Audio uses text-to-speech, which is cheap and has no novelty risk. |

**Size of the buyer pool [E]:** about **390k a year** at September's ELDT pace, or about 440k a year at the 2022–26 average, plus endorsement-only and hazmat-renewal test-takers who aren't all subject to ELDT. Those registry counts include endorsement and upgrade training, so this is not a count of first-time CLPs.

Rough sizing of the paying market **[E]**: the top 4 paid apps take in about $205k a month (about $2.5M a year). At about $40 per payer, that's roughly 60k payers a year, or about 15% of the pool.

## 6. Competitor pricing and channels
**Pricing (full table in `cdl-2026-10-28/prices_iap.md`):**

| App | Pricing |
|---|---|
| Best Fun Games | 1-week trial, then **$24.99/mo**; $59.99/yr; lifetime $59.99–$89.99 |
| DMV Genie | $14.99–$49.99/mo; lifetime **$99.99**; $99 Class A/B 30-day bundles |
| Khai Vuong | $9.99–$74.99 |
| Solvely | **$11.99/week**; lifetime $69.99 |
| BrainSoft | $2.99–$9.99/week; $39.99/yr; also shows ads |
| HLT | $6.99/mo; $23.99/yr |
| Jeffrey Diaz | **Free with ads, no paid tier** |

**Channels:**
- **Web search (Semrush, US):**

  | Keyword | Searches/mo | Difficulty (KD) |
  |---|---|---|
  | cdl practice test | 18,100 | 38 |
  | cdl permit test | 6,600 | 45 |
  | eldt | 6,600 | 46 |
  | hazmat practice test | **5,400** | **23** |
  | cdl pre trip inspection | 1,300 | 27 |
  | texas cdl practice test | 1,000 | 13 |
  | cdl air brakes practice test | 880 | 9 |
  | english proficiency test for truck drivers | 110 (falling) | — |

- **App Store keyword crowding (Appfigures):**
  - "hazmat practice test": 247 apps, competitiveness 49. **11 of the top 15 look like 2025–26 launches [E, from product-ID ranges].**
  - "cdl pre trip": 250 apps, **9 of the top 15 recent [E]**.
- **Word of mouth:** Reddit recommendations, CristCDL-style free web tests, and carrier recruiters telling applicants to "download CDL PREP app" before school (several Reddit items).
- **Not checked:** competitors' TikTok and YouTube presence, and Apple Search Ads spend (Partner access needed).

## 7. Recommendation
### Wedge, in order
1. **"The honest CDL app."** No ads, no auto-renewing plan, one-time unlock, restore that works on every device, and a clear free tier before any paywall. This addresses the 33% monetization theme and the 16% ads theme. The free leader can't copy it without losing its ad revenue. The paid leaders can't copy it without losing their trap revenue **[E]**.
2. **Current, correct and specific to the state and endorsement.**
   - A visible "Updated for 2026" changelog.
   - A citation to the manual section on every answer, and a "report a wrong answer" button with a public fix log.
   - Exact state formats, such as Iowa's 3-answer questions and Texas's Commercial Rules test.
   - **Hazmat done properly**, plus an endorsement-only mode for current CDL holders and hazmat renewers.
3. **Built for the English-only test.** Plain-English mode, a glossary, audio read-aloud and a hands-free listen mode, plus the Roadside English module (interview topics and signs).

### MVP, buildable in about 21 days, ranked
1. **Question engine and content for the permit (CLP) tests: General Knowledge, Air Brakes and Combination.**
   - States: **TX** (plus Commercial Rules), **CA** and **FL** first, with a national fallback.
   - Each question is original, written from 49 CFR (public domain) and paraphrased from state manuals, with a manual-section citation. Each one is checked against 2 sources.
2. **Exam simulator in each state's real format**, with the right count, pass mark and number of answers. Missed questions can be reviewed with no interruptions, progress autosaves, and nothing gets lost to a swipe.
3. **Missed-question drill, spaced repetition and a readiness score.**
4. **Hazmat endorsement**, the biggest search demand and the most "outdated" complaints. Then tanker and doubles/triples, then passenger and school bus. Include an endorsement-only mode.
5. **Honest paywall and store setup.** One-time purchases, working restore, no rating prompts tied to rewards, and a "what's free" screen.
6. **Audio read-aloud on every question and explanation, plus a hands-free listen mode.** Add the plain-English glossary, with an optional bilingual glossary for the terms only. The test stays in English.
7. *(v1.1, about 3 more days)* **Roadside English**: 5 interview-topic drills with speech recognition, and a MUTCD sign quiz.

**Defer or skip:**
- A pre-trip inspection trainer: the skills test is in person, and the niche is getting crowded.
- Becoming an ELDT provider.
- A chat AI tutor.
- Full Spanish practice tests.
- Web SEO companion pages with free state practice tests (CristCDL-style). This is the **main free acquisition channel** because there are no paid ads, so it gets built right after launch. Start with "hazmat practice test" (KD 23), "texas cdl practice test" (KD 13) and "air brakes" (KD 9).

### Pricing, to test
- **Free:** one full General Knowledge exam a day plus all explanations, with no ads.
- **CLP Pass $24.99 one-time:** every permit test for your state, for life.
- **Endorsement add-ons $9.99 each, or All-Access $34.99.**
- **No weekly plan, no trial and no subscription.**

Break-even math **[E]**:
- At about $21 net per sale (after Apple's 15% small-business cut), $1k a month takes about 47 sales a month.
- $10k a month takes about 470 sales a month, roughly 1% of the free leader's monthly downloads.

**No money-back guarantee.** App Store refunds are Apple's call. DMV Genie's "99.06% verified pass rate" claim is not worth copying.

### Avoid
- Subscription traps, ads, and "5★ to remove ads" (against store review rules).
- The word "Official", or DMV or state seals.
- Copying competitor question banks, **AAMVA manual text** (AAMVA copyrights the model CDL manual and licenses it only to state agencies; other parties need written permission), or real test questions that leaked.
- AI-generated images.

## 8. Main risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| **The free leader adds a remove-ads purchase** | Medium; it's an easy change | Our edge has to be accuracy, hazmat and audio as well as no ads |
| **Clone flood and Apple 4.3 "spam" rejections**; ASO gets harder | High (2026 entrants dominate the hazmat and pre-trip keyword results [E]) | Ship one distinct, polished app rather than templates. Get the angle into the first screenshot. Get the web SEO funnel running early. |
| **Not "word for word"**, the #1 love driver | Medium | Cover the manual completely, add a user-reported "saw this topic" loop, and run monthly updates. Don't use leaked test questions. |
| **Wrong answers create liability and 1★ reviews** | Medium | Two-source verification, citations, public fix log |
| **Honest one-time pricing earns less per user than the trap apps** | Medium | Track conversion. A premium bundle or fair annual price could be tested later. The $95k app shows how far a trap model can go, not a ceiling for us. |
| **Policy swings** (English-only spreading, the non-domiciled court ruling) | Ongoing | They mostly favor English-only prep. Watch the D.C. Circuit ruling. |
| **Apple policy** on subscription disclosures and misleading claims | Low if one-time and no "Official" | — |

**Legal note (not legal advice):**
- Facts and federal regulations (49 CFR) and federal MUTCD signs are free to use.
- State manuals are often AAMVA-licensed, so paraphrase and cite them; don't copy them.
- Write original questions.
- Get a short IP review before launch.

**Odds impact:** none from this pass. It supports keeping CDL as #1 at the .12 hit rate, with the condition that the wedge above ships. A plain "me-too" CDL app should be scored as an empty-angle bet (.10–.11).

## 9. Sources
- **Reviews:**
  - Apple RSS `itunes.apple.com/us/rss/customerreviews/id=<id>` for ids 1610099124, 6446039122, 1447415467, 1101536521, 1313483156, 6752642386.
  - Google Play via `google-play-scraper` for com.huyendt.cdl, com.bestfungames.cdl, dto.ee.cdl.genius, com.jeffreydiaz.android.app.cdlprep, com.vialsoft.cdlusafreemium, com.hltcorp.cdl, com.brainsoft.apps.cdl.
  - Raw files: `reviews_raw.json` and `reviews_coded.csv`.
- **Appfigures app profiles:** ua_Gk7GZG, ua_RHjl8I, ua_UkxOV0, ua_rm2r0s, ua_Y6yggE, ua_uBwzPw (`https://appfigures.com/reports/app-profile/<id>`).
- **Reddit (Apify run GRZMsXlCWVrZ64m1G):** `reddit/reddit_items.json`, e.g.
  - r/Truckers "One year of English proficiency enforcement" (Jan 21, 2026)
  - r/Truckers hazmat 2026 questions (Jul 10, 2026)
  - r/cdldriver "CDL Prep Ultimate" (Mar 4, 2026)
- **Government and regulatory:**
  - Texas DPS: https://www.dps.texas.gov/news/dps-announces-changes-cdl-knowledge-testing
  - USDOT, Feb 21, 2026: https://www.transportation.gov/briefing-room/driving-news-trumps-transportation-secretary-sean-p-duffy-and-fmcsa-administrator
  - FMCSA one-year release: https://www.fmcsa.dot.gov/newsroom/trumps-transportation-secretary-sean-p-duffy-celebrates-one-year-delivering-american
  - ELP NPRM: https://www.federalregister.gov/documents/2026/08/10/2026-16288/english-language-proficiency-out-of-service-criteria
  - ELP roadside policy MC-SEE-2026-0002: https://www.fmcsa.dot.gov/regulations/enforcement/fmcsa-elp-guidance-roadside-policy-mc-see-2026-0002
  - Carrier ELP guidance: https://www.fmcsa.dot.gov/regulations/what-should-motor-carrier-do-assess-cmv-drivers-english-language-proficiency-elp-during
  - Training Provider Registry: https://tpr.fmcsa.dot.gov/
  - Non-domiciled rule FAQs: https://www.fmcsa.dot.gov/regulations/non-domiciled-cdl-2026-final-rule-faqs
  - BLS: https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm
- **Other:**
  - State list snapshot (Zutobi): https://zutobi.com/us/driver-guides/2026-dmv-rules-test-updates-cdl
  - FreightWaves on the non-domiciled case: https://www.freightwaves.com/news/request-to-block-non-domiciled-cdl-rule-denied-case-heads-to-court
  - AAMVA manual copyright notice: https://www.in.gov/bmv/files/CDL-Manual.pdf
  - ELDT prices: https://eldt.io/, https://eldt365.com/eldt-training-cost
  - Aurora: https://ir.aurora.tech/news-events/press-releases/detail/132/aurora-triples-driverless-network-to-10-routes-and-prepares-to-expand-across-u-s-sun-belt
- **Semrush:** `cdl-2026-10-28/semrush_cdl_batch.csv`.

## 10. Tool spend
| Tool | Spend |
|---|---|
| Apify | about **$0.38 [E]** (178 results × $0.002 + $0.02 start) |
| Treg | **$0** (not needed; public Apple and Google endpoints were free) |
| Semrush | **80 API units** (8 rows) |
| Appfigures | free-tier calls only |
