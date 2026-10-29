# CDL Prep Apps: What People Dislike, and How Design Can Set Us Apart
**Written:** Wed Oct 28, 2026, about 10:15 AM PT, for Sean, who leads CX.
**Follows:** `cdl-differentiation-2026-10-28.md`, `cdl-pricing-2026-10-28.md` and `cdl-build-spec-2026-10-28.md`.
**Raw data:** `cdl-2026-10-28/ux/`.
**Rule:** quotes are copied word for word from the scraped data. Counts come from the hand-coded sample unless marked *keyword scan*. **[E]** marks an estimate or judgment.

---

## 0. Summary
- **The biggest complaints aren't about visual design.** They're about **honesty, reliability and whether the questions are right.** In 343 hand-coded complaints:
  - 48% involve money or ads;
  - 33% involve accuracy or fit to the real test;
  - 24% involve reliability (crashes, purchases lost, progress lost, broken onboarding).
- Classic UX complaints are rare in reviews: dark mode came up once in 1,627 negative reviews, search once. **Our design edge has to fix the trust and flow failures people actually hit**, and look visibly better while doing it.
- **The best design lever is making trust something you can see.** Show the source on every answer. Never interrupt a test. Make "pay once" obvious. Never lose progress. Use type you can read in a truck cab. Rivals don't show any of this in their screenshots.
- **Competitor visuals all look alike.** Bright red or blue ed-tech, "Pass on your first try", star badges, question counts, mascots and gold "#1" laurels. None of them shows price honesty, sources, a "last checked" date, audio, or readable large type.
- **The closest design rival is Hanh Le** (48.6k ratings at 4.9). It has a polished exam picker and endorsement toggles. **Easy Pass already shows a "CDL Passing Probability" readiness bar, so a readiness score alone doesn't set us apart.** Ours has to explain itself and tie to a test date.
- **Signature experiences:**
  1. **"Proof" answer sheet:** why the answer is right, the source, and when we last checked it.
  2. **Cab Mode:** hands-free listening, large type and a high-contrast mode for glare.
  3. **Test Day plan:** a test-date countdown, a readiness check that explains its score, and mistakes replayed before test day.
- **What holds up over time:** a public accuracy track record, review volume, state and endorsement depth, and the SEO pages. Polish and no-ads can be copied within a release or two **[E]**.

## 1. Data and method
**Reviews:**
- **Corpus:** 6,112 unique reviews (the 3,981 from earlier plus 3,071 newly pulled today, deduplicated), of which 1,627 are 1–3 stars.
- **New sources:**
  - Apple's public review feed for Hanh Le (500), Easy Pass (500), Mapola (129), Wei Zhang (295), PATG (73) and Solvely (31). BrainSoft had 0.
  - Google Play via google-play-scraper for VZ (400), Easy Pass (19), CristCDL (55) and DMV Written Test (363), plus low-star pulls for Jeffrey Diaz, Best Fun Games, DMV Genie, Khai Vuong and BrainSoft. Those mostly duplicated reviews we already had.

**Hand-coded sample:**
- **356 negative reviews (1–3★), read one by one.** Taken from each app's most recent negatives with a cap per app, and with at least 40 characters of text.
- **Mix:** 201 iOS and 155 Play; 238 one-star, 54 two-star, 64 three-star. Dated Feb 2019 to Oct 27, 2026; 203 are from 2025 or later and 149 from 2026.
- **Codes:** 34 granular codes, more than one allowed per review. 343 reviews were real complaints; 13 were off-topic or praise.
- **Caveat:** older apps (Easy Pass, Mapola, PATG, Hanh Le) have fewer recent negatives, so some of their sampled complaints date from 2021–23.
- Files: `handcoded_356.csv` and `handcode_summary.json`.

**Keyword scan:** run over all 6,112 reviews for UX terms the hand sample rarely hit (`keyword_ux_scan.json`). It's directional only.

**Reddit:**
- 94 new items (Apify `harshmaur/reddit-scraper`; 6 searches over the past year, posts and comments), plus the 178 earlier items.
- Files: `reddit_new.json`, `reddit/reddit_items.json`.

**YouTube:** 100 comments from 6 of the 7 CDL app-review and HazMat study videos (`supreme_coder/youtube-comment-scraper`); one video returned no comments. File: `youtube_comments.json`.

**Mobbin:** 8 iOS screen searches (links in §7).

**Competitor listings:** the first 3 App Store screenshots for 10 apps (`ux/shots/*.jpg`). I looked closely at 6 of them.

## 2. Granular pain points (hand-coded, n = 343 complaints)
| # | Pain point | Reviews | % |
|---|---|---|---|
| 1 | **Not on the real test, outdated, or not in the manual** | 67 | 19.5% |
| 2 | **Crashes, freezes, won't load, scoring bugs** (marks right answers wrong) | 52 | 15.2% |
| 3 | **Can't cancel, charged after cancelling, refund refused** | 41 | 12.0% |
| 4 | **Wrong answer keys** | 34 | 9.9% |
| 5 | **Paid but still locked, purchase or lifetime lost, ads still shown after paying** | 29 | 8.5% |
| 6 | **Ads that break the flow** (mid-question, can't close, block results, force a restart) | 28 | 8.2% |
| 7 | Price too high, or "should be free" | 27 | 7.9% |
| 8 | **Confusing wording or grammar; reads like a bad translation** | 24 | 7.0% |
| 9 | Too many ads (volume) | 24 | 7.0% |
| 10 | Paywall too early, free tier useless | 23 | 6.7% |
| 11 | Wrong or missing state; other states' questions show up | 20 | 5.8% |
| 12 | "Free" or trial bait; charged at once; card required | 18 | 5.2% |
| 13 | Missing test or endorsement (TX Commercial Rules, Class B, thin HazMat) | 17 | 5.0% |
| 14 | No support or no response | 16 | 4.7% |
| 15 | Same question repeated within one test; small bank | 13 | 3.8% |
| 16 | **Can't review wrong answers, no instant feedback, missed questions never re-asked** | 9 | 2.6% |
| 17 | Confusing navigation, mis-taps, layout | 8 | 2.3% |
| 18 | **Onboarding broken** (state picker loops forever) | 7 | 2.0% |
| 19 | Text cut off or unreadable | 6 | 1.7% |
| 19 | Wants Spanish or another language | 6 | 1.7% |
| 21 | Lost or reset progress | 5 | 1.5% |
| 21 | Sections mixed up (bus questions in Combination) | 5 | 1.5% |
| 21 | Doesn't teach; no context or study material | 5 | 1.5% |
| 24 | Forced ELDT or certificate upsell | 4 | 1.2% |
| 24 | Explanation missing or contradicts the key | 4 | 1.2% |
| 26 | Feels AI-generated or untested | 3 | 0.9% |
| 26 | Slow or laggy | 3 | 0.9% |
| 26 | Account or cross-device sync problems | 3 | 0.9% |
| 29 | Rating prompts mid-study, or review-for-reward | 2 | 0.6% |
| 29 | References an image that isn't shown | 2 | 0.6% |
| 31 | Paywall interrupts mid-test | 1 | 0.3% |
| 31 | Unwanted notifications | 1 | 0.3% |
| 31 | Privacy or data sharing | 1 | 0.3% |
| 31 | Audio or text-to-speech mispronounces | 1 | 0.3% |

**Grouped** (a review counts once per group):

| Group | Reviews | Share |
|---|---|---|
| Money or ads, any | 166 | 48% |
| Content accuracy or fit | 113 | 33% |
| Reliability (crash, purchase lost, progress lost, onboarding broken, slow) | 82 | 24% |
| Billing trust (cancel, trial bait, purchase lost) | 77 | 22% |
| Learning design (explanations, wording, review, teaching) | 39 | 11% |
| State or endorsement fit | 39 | 11% |
| Flow interruptions (ads that break the flow, mid-test paywall, rating prompts) | 31 | 9% |
| Readability (cut-off text, wording) | 28 | 8% |

**Keyword scan of all reviews** (1,627 negative / 4,485 positive):
- **Negative-heavy terms:**

  | Term | Negative | Positive |
  |---|---|---|
  | crash / freeze / glitch / won't load | 48 | 7 |
  | login / account / sign in | 38 | 8 |
  | text size, cut off, hard to read | 23 | 1 |
  | Spanish / language | 20 | 14 |
  | audio / listen | 13 | 12 |
  | progress | 10 | 16 |
  | notifications | 6 | 2 |

- **Almost never mentioned:** dark mode (1), search (1), offline (2).
- **What people praise:** "easy to use / user friendly" (158 positive vs 12 negative) and "explanation" (118 positive vs 25 negative).

**What this means for design [E]:**
- Nobody asks for dark mode or search. They assume an app works and won't trick them.
- Design wins come from:
  1. never interrupting study;
  2. never losing progress or purchases;
  3. showing why an answer is right;
  4. text you can always read;
  5. plain wording.
- The account and login complaints are almost all DMV Genie: restore, sync and lost lifetime access. That supports **no account plus a Restore that works**.

## 3. Quotes (verbatim; app, store, stars, date)
**Paywall and trial:**
- "Great unless you actually want to get more than half way through a practice test. Then they want you to pay for a monthly subscription when in reality I shouldn't need the app for more than a month to get my damn CDL." (Khai Vuong, Play, 1★, Oct 24, 2025)
- "App says "Take a free test" click on it and immediately forces you to pay 25 bucks a month just to take a test." (Best Fun Games, Play, 1★, Jun 23, 2026)
- "i took a trial and they charged me a whole year and i could not cancel the subscription until Dec 2026" (Khai Vuong, iOS, 1★, Jan 2, 2026)

**Purchases lost or changed:**
- "I paid 99.99 a while back for lifetime subscription and now it says I don't have a subscription." (DMV Genie, iOS, 1★, Apr 22, 2026)
- "I had already paid to remove the adds. Now it has the add to buy a subscription that wasn't there before." (Hanh Le, iOS, 1★, Jul 26, 2026)

**Ads that break the flow:**
- "I took the practice exam and at the end you can go over the questions you get wrong but then the ad pops up and it won't let you go over the exam." (Jeffrey Diaz, iOS, 2★, Oct 8, 2026)
- "Make sure the X you click to close the ad, isn't the ad itself." (Wei Zhang, iOS, 2★, May 4, 2026)

**Accuracy:**
- "it's the identification number and this app thinks it's the shipping name. I don't trust it anymore" (Hanh Le, iOS, 1★, Feb 6, 2026, HazMat). A YouTube commenter flags the same error in a HazMat study video: "#38 is wrong. It should be (c) the identification number goes first." (Fw8_ASnjmh4, "1 month ago")
- "Several questions in the pool will mark your answer incorrect then proceed to explain the reasons the answer is correct." (Jeffrey Diaz, iOS, 2★, May 23, 2026)
- "with hazmat more than half of the questions that were on the test weren't in the app." (Jeffrey Diaz, iOS, 3★, Jun 1, 2026)
- "completely leaves out the Commercial Rules test that is required prior to taking any of these tests at Texas DPS." (Jeffrey Diaz, Play, 3★, Aug 25, 2026)
- "It will ask questions that are from different states even when I selected a state in which I want to get CDL." (Khai Vuong, iOS, 1★, Sep 28, 2026)

**Learning design:**
- "Why would it wait till the end to let me know the test is wrong?" (Best Fun Games, iOS, 1★, Sep 5, 2026)
- "there's no context. ... there's no button to get context either." (Jeffrey Diaz, Play, 2★, Feb 26, 2026)
- "Just questions that they never reask if you get it wrong." (Best Fun Games, Play, 2★, Mar 3, 2026)
- "I feel like this is some AI generated app without proper testing." (Best Fun Games, iOS, 1★, Jun 5, 2026)

**Readability:**
- "There are so many grammar errors it's hysterical." (Wei Zhang, iOS, 3★, May 7, 2024)
- "For a lot of the questions the answers choices are cut off so you can not properly select the correct answer." (Mapola, iOS, 1★, Jun 9, 2021)
- "It need dark mode, too bright" (Hanh Le, iOS, 1★, Sep 13, 2024)

**Reliability and onboarding:**
- "If you swipe left accidentally at all, ALL of your progress is gone." (Jeffrey Diaz, iOS, 1★, Jun 1, 2026)
- "asks for my state, press next and repeats infinitely" (DMV Written Test, Play, 1★, Jul 2, 2026)

**Endorsement-only and ESL users:**
- "When I selected Hazmat it won't let me opt out of the certificate class." (DMV Genie, iOS, 1★, Apr 26, 2026)
- "It would be better if the text in the test questions could be copied. Because those who do not speak English can use translators more easily." (DMV Genie, iOS, 3★, Oct 18, 2023)

**Requests:**
- "it could use headphones mode to be able to listen to help with learning" (Jeffrey Diaz, Play, 5★, Jul 10, 2026)

## 4. What each rival is worst at
Top codes in the hand-coded sample (n = that app's complaints), plus what I saw in its listing.

| App | n | Worst at | Design opening for us |
|---|---|---|---|
| **Jeffrey Diaz** (free leader) | 44 | Flow-breaking ads 14; not on the test 11; ad volume 10; missing endorsement or TX Commercial Rules 8; wrong keys 6. Dated look (old iPhone frames, plain lists). | Uninterrupted study, a modern UI, a full HazMat bank and TX Commercial Rules. |
| **Best Fun Games** | 45 | Can't cancel 11; crashes 8; paywall too early 7; wrong keys 7; price 7. Mascot and bright ed-tech look. | One-time price; a free test that really is free; reliability. |
| **DMV Genie** | 39 | Purchase or lifetime lost 9; price 9; can't cancel 6; forced ELDT certificate 4. Social-proof-heavy listing ("9M+ drivers"). | No account, Restore that works, endorsement-only purchase ($4.99 HazMat). |
| **Hanh Le** | 35 | Paid but still ads or locked 8; ad volume 8; crashes 7; wrong keys 6; TX topics lost after an update. **The best-designed rival.** | Accuracy you can see; no changing the deal after purchase. |
| **Khai Vuong** | 30 | Can't cancel 12; trial bait 6; repeated questions 6; paid but locked 5. | Honest pricing; no repeats within a test; state filtering that works. |
| **Mapola** | 29 | Crashes 7; not on the test 7; can't cancel 6; no support 4. | Reliability; responsive support with a public fix log. |
| **Easy Pass** | 23 | Not on the test 5; crashes 4; paid but locked 3; flow-breaking ads 3. Has a readiness bar ("CDL Passing Probability"). | Readiness that explains itself; accuracy. |
| **PATG** | 15 | Crashes or broken questions 5; not on the test 4; no support 3; typos 3. Gold "#1 / The Original" look; older UI. | Clean modern type; questions with no typos and no dead ends. |
| **Wei Zhang / VZ** | 18 | Not on the test 7; grammar 4; wrong keys 4; deceptive ad close buttons. | Plain-English wording, proofread. |
| **DMV Written Test** | 17 | Onboarding state picker loops forever 7; crashes 7; not on the test 5. | A three-step onboarding that can't break. |
| **Iteration / Vialsoft** | 17 | Not really CDL (Class C or Canadian content) 4; not on the test 4; scoring changes answers. | — |
| **Solvely** | 8 | Can't cancel 3; not on the test 3; off-topic questions (ambulance questions in GK). | — |
| **BrainSoft** | 7 | Trial bait 2; paywall 2; can't cancel 2. | — |
| **CristCDL** | 6 | App crashes and loses progress; users fall back to its website. | Our web pages should run the same engine as the app. |

## 5. Table stakes: what users praise that we must match
From the Task 1 praise coding of 1,481 positive reviews, plus today's keyword scan of 4,485 positive reviews:
- **"Passed" (418) and "matches the real test" (156).** Coverage and accuracy come first; design comes second.
- **Explanations** (118 positive mentions today) and manual-section references (62 in Task 1). Best Fun Games and PATG ("See Why") put explanations in their screenshots.
- **"Easy to use / user friendly"** (158 positive). Simple wins. Jeffrey Diaz's two-button "Practice / Exam" home is praised for that reason.
- **Practice mode vs exam mode,** section by section (a constant Reddit study method: "take respective section over and over"). **Topic summaries and scores** (Jeffrey Diaz's Topic Summary; Best Fun Games's results ring).
- **Free to start.** Reddit's default advice is "CDL Prep app is free." Our free test per section is required, not optional.
- **Class A and B plus every endorsement in one app** (Hanh Le and Easy Pass screenshots).

## 6. Reddit and YouTube signals (new pulls)
**Reddit:**
- An indie developer in r/ClaudeAI says they built their own CDL test "because I am sick of all the slop coded inaccurate paywalled and ad riddle practice test apps out there." This is a single comment.
- **New indie rival:** "CDL Prep Ultimate" posted in r/cdldriver, r/CDLTruckDrivers and r/findapath (Mar 2026): "I built a CDL Prep app by myself with NO Ads… 2,900+ questions… all endorsements." It's on iOS and Android with promo codes. **The no-ads angle is already being pitched in this community.**
- Recurring questions: "Is the CDL Test Prep app reliable today?", "Should you pay for CDL prep to study?", "Anyone know which app is up to date for 2026?", "Anyone know where to find updated questions and answers for 2026 hazmat endorsement test?" People want proof that content is current. That fits the "Last checked" chip and the public fix log.
- Texas advice in comments: "if your in Texas do Special Requirements"; "It doesn't have special requirements questions though."

**YouTube:**
- Passive viewing is common. "I watched it 1.5 times en route to a California Commercial DMV. Passed the first shot!" and "Went over this 3 twice". This supports Listen and Cab Mode.
- The HazMat ID-number ordering error shows up in a video too, which supports visible sources.

## 7. Best-in-class UX patterns (Mobbin)
| Need | Pattern | Reference | Our adaptation |
|---|---|---|---|
| Answer feedback | Bottom sheet that slides up, says Correct or Incorrect, shows the answer, has a flag icon and one big Continue button | [Duolingo: Correct! sheet with flag](https://mobbin.com/screens/ef9d6413-1e91-4f2c-8317-25d63ceee5bf); [Ahead: "Try again!" sheet](https://mobbin.com/screens/5967dc8e-fc20-4b10-910f-df0f675c804d) | Feedback sheet in practice mode. Not shown during the simulator. |
| Explanation | Card that leads with the correct answer in bold, then the why, with the key sentence highlighted and an audio button | [Noom: "The correct answer is…"](https://mobbin.com/screens/02390160-9646-40c5-aa67-c87ff11d9f3c) | The "Proof" sheet: answer, then why in 1–3 plain sentences, then the source chip and "Last checked", with a 🔊 button. |
| Report a mistake | A reason list in a bottom sheet: "My answer is correct / The explanation is wrong / …contradictory" | [Duolingo: Share feedback](https://mobbin.com/screens/f6732d72-7715-44a5-9a4b-630f4acfff42) | Copy the structure. Reasons: Wrong answer, Outdated, Not in my state's manual, Confusing wording, Typo, Other. |
| Inline progress | Segmented progress bar plus inline "Excellent!" on the selected option | [Quizlet Learn](https://mobbin.com/screens/9756426e-c050-4297-a5cf-225fd0d9f3d5) | A progress bar with the question count. Calm feedback. |
| Results | Each question listed with a Correct or Incorrect bar | [Quizlet results](https://mobbin.com/screens/ebc28893-dc9f-4fc9-9de9-ab790185a4f1) | Results list filtered to "Missed", with "Replay mistakes" as the main button. |
| Onboarding choice | Two large cards for "What do you want to learn first?" with progress at the top | [Brilliant](https://mobbin.com/screens/401fae39-6fd4-42b1-955c-02814892a5d2); [Ro checkbox goals](https://mobbin.com/screens/2aeae146-e9a5-429a-a48d-b7da48039d0c) | Goal cards: "Getting my permit" or "Adding an endorsement". Endorsements as checkbox rows. |
| Readiness | Score gauge with labeled zones (off-track → optimal) | [Lifesum Life Score](https://mobbin.com/screens/a47b0627-64eb-42b1-bb9e-62e5d9ac66a0); [WHOOP plan results gauge](https://mobbin.com/screens/2f82e79e-543d-43c6-b74c-14248de208b0) | A Ready check gauge per section (Not yet / Getting close / Likely ready), each with a "why" breakdown. |
| Countdown | Big ring reading "6 DAYS until check-in" | [MacroFactor Strategy](https://mobbin.com/screens/4ba39cbc-32e5-4d63-9fc7-96aebf3e0db6) | "4 days to your Air Brakes test", with today's plan. |
| Improve-your-score tips | "Two ways to improve your score" cards | [Lifesum weekly insights](https://mobbin.com/screens/995c8574-0cd0-445b-871e-f8e1704b8f84) | "Two topics holding you back: Placards, Air brake checks." |
| Read / Listen choice | Two big CTAs, Read and Listen, on every content item | [Headway summary](https://mobbin.com/screens/ff742cc6-9b71-4b04-8f1a-2ac1524e948f) | Every section offers "Practice" or "Listen". |
| Audio player | "Key point 1 of 10", scrubber, speed chip, skip back 5 / forward 10 | [Headway player](https://mobbin.com/screens/ff4a5f03-7d42-4f57-a251-dfa5e3961a00) | Cab Mode player: "Question 3 of 25", speed, replay, next, big targets. |
| Honest paywall | Options include "Lifetime: Pay once, use forever"; Restore shown under the main button | [Joi paywall](https://mobbin.com/screens/f534ccc2-5c15-4ef1-b50c-b823dd786fa6) | One-time products only, "Pay once. Yours to keep." Restore always visible. |
| Anti-pattern | Trial-first paywalls ("Start your 3-day FREE trial", "Start my free week") | [Cal AI](https://mobbin.com/screens/e145982d-dec3-4809-9325-816c72f9db32); [Brilliant](https://mobbin.com/screens/4769fa19-5abe-4bd9-8b9e-e1260ace9d56) | This is exactly what CDL reviewers call bait. Don't do it. |

A Mobbin search for spaced-repetition review screens returned nothing relevant, so the drill UI follows the Quizlet and Duolingo patterns above.

## 8. How competitors present themselves (first 3 App Store screenshots), and the gap
| App | What the screenshots say | Look |
|---|---|---|
| Hanh Le | "MOST-REVIEWED CDL APP · Pass your CDL on the first try · ★4.9 · 46,000+ drivers passed"; "Built for the license you want" (exam picker); "Every endorsement. One app." | Red-orange, modern iOS cards, toggles. **The most polished.** |
| DMV Genie | "Prep & pass your CDL test ★ first try · 2026 update"; "9M+ drivers prepared" with testimonial photos; "1,500+ real exam-like Qs · State-specific phrasing & difficulty" | Electric blue and yellow, illustrated questions, social proof |
| Easy Pass | "CDL PRACTICE TEST 2026 · Pass on your first try · 4.9 · 28K ratings"; a "PASSED" stamp; Class A/B plates; "ALL CDL ENDORSEMENTS" | Navy with road graphics; readiness bar visible |
| PATG | "The Original CDL Practice Test® · #1 App for Passing the CDL TEST"; "All-New Updated Questions 1,600+"; "See Why Explanations" | Black and gold laurels; dense older UI |
| Best Fun Games | "Ace your CDL test!" with a truck mascot; "1600+ questions with explanations"; "Review test results & explanations" (80% ring, community averages) | Bright primaries, cartoon |
| Jeffrey Diaz | Plain Practice / Exam Mode buttons, Topic Summary; "8 CDL topics covering over 500 questions" | Old iPhone frames, system blue, dated |

**The gap no rival fills [E]:**
1. **Nobody shows the price model.** Every listing hides the paywall, so "Pay once. No ads. No auto-renew." on screenshot 1 is unclaimed.
2. **Nobody shows provenance.** PATG says "See Why" and DMV Genie says "real exam-like", but no screenshot shows a manual section, a regulation reference or a "last checked" date.
3. **Nobody shows audio, hands-free use or large type,** and nobody designs for a cab, glare or reading glasses.
4. **Everyone promises "first try."** It's generic and unverifiable. A calm, factual tone would stand out.
5. Visual sameness: saturated red, blue or gold, mascots and laurels. A restrained, road-sign-legible look would read as different and serious **[E]**.

## 9. Differentiators, ranked
| Rank | Differentiator | Pain it fixes (evidence) | Design pattern | How it appears in the first 3 screenshots |
|---|---|---|---|---|
| 1 | **Honest, uninterrupted study.** No ads, no mid-test paywall, no rating prompts in a session, and a free test that really completes | Money and ads 166/343 (48%). Flow-breaking ads 28; paywall too early 23; trial bait 18; "Take a free test… forces you to pay" | Paywall appears only at a section boundary and only after the free test finishes. Joi-style "Pay once" with Restore always visible. No trial. | **#1:** "Pay once. No ads. No auto-renew." over a clean question screen |
| 2 | **Proof on every answer.** Why it's right, the paraphrased source, the manual section and regulation, "Last checked", and a one-tap report | Not on the test 67; wrong keys 34; explanation contradicts the key 4. People ask "which app is up to date for 2026?" | Noom-style answer card plus a source chip, a Duolingo-style feedback sheet and a public "What we fixed" log | **#2:** "Every answer shows its source", with the Proof sheet visible |
| 3 | **Your state, your test, your format.** TX Commercial Rules, CA, FL, HazMat-first, endorsement-only, and never another state's question | Wrong or missing state 20; missing test or endorsement 17; sections mixed up 5; DMV Genie forced certificate; TX quotes | Brilliant- and Ro-style goal and state cards, a state badge on state-specific questions, "Adding an endorsement" path | **#3:** "Texas? Commercial Rules included. HazMat done right." with the state and endorsement picker |
| 4 | **Never lose anything.** Progress, purchases and settings survive swipes, updates, reinstalls and offline use | Reliability 82 (24%): crashes 52; paid but locked 29; onboarding broken 7; lost progress 5 | Autosave every answer, back-swipe confirmation, Restore with no account, offline-first, a state picker that can't loop | Caption on #1: "Works offline · Restore anytime" |
| 5 | **Readable anywhere.** Large type, nothing cut off, high-contrast Sun Mode, dark mode, plain-English wording at about an 8th-grade level | Wording and grammar 24; text cut off 6; dark mode 1; font complaints; ESL users copying text into translators | Dynamic Type up to accessibility sizes, full-width answer rows that wrap, a minimum 48pt tap target, Atkinson Hyperlegible, Sun Mode | Shown inside the #1 frame: big, clean type |
| 6 | **Learn, don't just memorize.** Instant feedback in practice, mistakes replayed, a "context" link per topic | Can't review, no instant feedback, missed questions not re-asked 9; no context 5 | Practice-mode feedback sheet, results filtered to "Missed", a "Replay mistakes" CTA, spaced-repetition drill, a 60-second "Know this first" card per topic | Screenshot 4 or 5 |
| 7 | **Cab Mode / Listen** | Requests ("headphones mode"); YouTube users study passively "en route"; audio mentioned in 25 reviews (13 negative, 12 positive) | Headway-style Read/Listen CTA and player | Screenshot 5 |
| 8 | **Ready check and Test Day plan** | Readiness isn't unique (Easy Pass, Hanh Le), but nobody ties it to a test date or explains it | WHOOP- and Lifesum-style gauge with "why", MacroFactor-style countdown, Lifesum-style "two topics holding you back" | Screenshot 4 |

## 10. Signature experiences (the "obviously better" moments)
1. **The Proof sheet** (practice mode, after each answer):
   - "Correct" or "Not quite", then the right answer in bold.
   - **Why** in 1–3 plain sentences.
   - A source chip: `TX CDL Handbook §9.6.2 · 49 CFR 172.202 · Last checked Oct 2026`.
   - Buttons: 🔊 Read aloud, Flag a problem, Continue.
   - Tapping the chip opens a "Source" card: a **short paraphrased excerpt** (no verbatim manual text) plus a link to the free official manual.
   - Mistakes go into a **Mistake Replay** queue automatically, and the results screen leads with "Replay 6 mistakes".
2. **Cab Mode** (for in-cab or parked study, never while driving):
   - Big type, Sun Mode contrast and a 2-button layout.
   - Listen mode reads the question, pauses, reads the options, pauses, then gives the answer and why.
   - Speed 0.75–1.5×. It works offline and with the screen locked [VERIFY background audio on iOS and Android].
   - Show a safety line at the start: "Listen only — don't use the screen while driving." Voice answers ("say A, B or C") come in v1.1.
3. **Test Day plan:**
   - The user enters a test date (optional) and sees a countdown ring.
   - **Ready check** per section with a breakdown ("Seen 92% · Mastered 78% · Last 3 simulators 84/88/90").
   - "Two topics holding you back" cards and a plan for today, in minutes.
   - The night before, it offers "Replay all mistakes" and an **Exam-day card** listing what to expect for that state's test format (question count and pass mark from the verified StateFormat table). "What to bring" goes in only once it's sourced per state [VERIFY].
4. **Simulator in the real format.** Exact counts, pass marks and number of answers, with no feedback until the end, **like the DMV**, and practice mode has instant feedback. This answers both complaint types ("wait till the end" in practice, and realism in the simulator).

## 11. Brand and visual direction
- **Feel:** calm, factual, built for professionals. Think of a good instructor or dispatcher who tells you straight. Not a game, not a hype ad.
- **Type:**
  - **Atkinson Hyperlegible** (free; designed by the Braille Institute for low vision) for questions and answers, or Inter if it renders better in React Native.
  - Body text at least 18pt by default, scaling with Dynamic Type to accessibility sizes. No text truncation anywhere.
  - Tabular numbers for scores.
- **Color:**
  - Neutral asphalt or charcoal on off-white, with **one road-sign accent** (highway-sign green, or school-bus amber as an accent only).
  - Correct and incorrect use color plus an icon and a word, never color alone (color-blind users).
  - **Never use hazmat placard colors as decoration**, because they carry meaning on the test.
  - Dark mode follows the system. **Sun Mode** is maximum contrast for glare, with thicker strokes.
- **Imagery:** simple line icons for vehicles and components. No mascots, laurels or "PASSED" stamps. Diagrams only where the manual has one (air brake system, placards), drawn originally.
- **Tone of voice:**
  - Short sentences, about an 8th-grade reading level or lower for explanations (check automatically).
  - Define terms inline (tap to define).
  - Never claim "pass first try", "real test questions" or a pass rate. Use "Practice the way the test works."
- **Microcopy examples:**
  - "Pay once. Yours to keep."
  - "No ads. Ever."
  - "Every answer shows where it comes from."
  - "Found a mistake? Tell us. We check every report."
  - "Not a guarantee — a study guide."
- **Motion and sound:** subtle. No autoplay sound. Haptics on answer (can be turned off).

## 12. What not to do
- No trial-first paywall, no "Take a free test" button that opens a paywall, and no paywall mid-test.
- No ads, no "watch an ad to continue", no rewarded reviews ("5 star review… remove ads" appears in BFG reviews), and no rating prompt during a session.
- Don't change the deal after purchase. Hanh Le's remove-ads buyers later hit a subscription wall.
- No forced account. Don't bundle ELDT or certificates with endorsement prep.
- No swipe gesture that discards a test, and no state picker that can loop.
- No mascots, streak shaming, guilt notifications, or gamification that slows down adult learners.
- No filler or AI-sounding questions (Solvely's ambulance questions in General Knowledge; "AI generated" complaints). No question may repeat within one simulator.
- No unverifiable claims ("9M+ drivers", "#1", "real exam questions", pass rates).

## 13. Which edges can be copied and which compound
| Edge | Can rivals copy it? | Why |
|---|---|---|
| No ads / remove ads | **Fast**, about 1 release | Hanh Le already sells remove-ads for $5.99. Jeffrey Diaz could add it any time. CDL Prep Ultimate already pitches no ads. |
| One-time price | **Fast** | Lifetime tiers already exist (Hanh Le $39.99, Easy Pass, Best Fun Games, Solvely, DMV Genie). The honest framing is harder for subscription apps to adopt because it costs them trial revenue **[E]**. |
| Visual polish, dark mode, large type | **Medium** | Hanh Le is already polished. Design is a multiplier for reviews, not a moat. |
| Readiness gauge | **Already exists** (Easy Pass, Hanh Le) | Ours must explain itself and tie to a test date. |
| Audio / Listen | **Medium** | Text-to-speech is commodity; a well-designed hands-free flow takes effort. |
| **Accuracy pipeline plus public fix log** | **Slow, and it compounds** | Months of dated fixes and "last checked" history can't be faked overnight. It becomes review language ("accurate", "sources"). |
| **State and endorsement depth** (TX Commercial Rules, HazMat) | **Slow** | Content work per state. Expand state by state. |
| **Reviews and rating count** | **Compounds** | The leaders have 7k–48k ratings. Trust and reliability are what earn 5★ reviews. |
| **SEO pages built from the same verified bank** | **Compounds** | Rankings and links accrue. CristCDL shows web-first study works. |

## 14. Proposed changes to the build spec
Not applied yet; for Sean to approve.

**§1 Positioning**
- Add design principles: *Never interrupt · Show the proof · Never lose anything · Readable anywhere · Plain English.*
- Add the brand direction from §11.

**§5 Screens and flows**
- **Question screen:**
  - Full-width answer rows that wrap. No truncation at any text size.
  - Minimum 48pt tap targets.
  - The state badge on state-specific questions.
- **Practice feedback:** replace the inline explanation with the **Proof sheet** (§10.1), including the source card with a paraphrased excerpt and a link to the official manual.
- **Results:** default to the "Missed" filter, with a **"Replay mistakes"** primary CTA.
- **New screen: Test Day plan.** Optional test date, countdown, Ready check breakdown, "two topics holding you back", Exam-day card.
- **Paywall:**
  - Shown only at a section boundary after the free test **completes**. Never mid-test.
  - Copy: "Pay once. Yours to keep. No ads. No auto-renew." Restore is always visible.
  - No trial anywhere.
- **Onboarding:**
  - At most 3 screens, Brilliant/Ro-style cards, a searchable state list with a "Not sure — use national" option.
  - **A QA test that the state picker can't loop** on small and large Android screens.
- **Rating prompt:** never during a session; only on Home after the 2nd passed simulator (the existing rule, made explicit).
- **Report a mistake:** reasons become Wrong answer, Outdated, Not in my state's manual, Confusing wording, Typo, Other.

**§6 Data model**
- Add `source_excerpt_paraphrase` (string, ≤240 characters) and `official_manual_url`.
- Add `figure_asset?`; lint fails if the question text references a figure without one.
- Add `reading_grade` (computed).

**§7 Content pipeline (lint additions)**
- Explanations must score at about an 8th-grade reading level or lower.
- Run a grammar and spelling pass (for example LanguageTool) on every question and option.
- No repeated question IDs or near-duplicates within one simulator draw.
- Section integrity: a question's `section` must match its topic map, so no bus questions in Combination.
- State scoping: a non-national question only shows for its state.
- HazMat basic-description order (ID number → proper shipping name → class → packing group, 49 CFR 172.202 [VERIFY]) becomes a known-trap regression test.

**§8 Features**
- **Promote to P0:**
  - Large type, Dynamic Type to accessibility sizes, and **Sun Mode**.
  - VoiceOver and TalkBack on the question, feedback and results screens.
  - "Replay mistakes".
- **Rename Listen to Cab Mode** (P1). Add the safety line and lock-screen audio [VERIFY].
- **Ready check becomes P1 with an explanation breakdown.** Add Test Day plan as P1. If time is tight, move the Ready check to v1.0.1 and ship the countdown without it.
- Voice answers stay v1.1, after Roadside English.

**§9 Store listing**
- **Screenshots 1–3:**
  1. "Pay once. No ads. No auto-renew."
  2. "Every answer shows its source."
  3. "Texas? Commercial Rules included. HazMat done right."
- **Screenshots 4–5:** Ready check / Test Day; Cab Mode.
- Visuals: neutral background, one accent color, no mascots or laurels, no "first try" claim.
- Add "readable", "audio" and "no ads" to the description.
- Add the keyword candidates "audio" and "hazmat practice" [VERIFY character budget].

**§10 Analytics**
- Add events: `text_size_changed`, `sun_mode_toggled`, `proof_sheet_source_opened`, `replay_mistakes_started{n}`, `test_date_set{days_out}`, `cab_mode_minutes`, `paywall_viewed{after_free_test_completed: bool}`.
- **Guardrail metric:** paywall views mid-test must equal 0.

**§11 Milestones**
- **M1:** add design tokens (type ramp, color, Sun Mode) and a snapshot test at the largest Dynamic Type size.
- **M5:** add a 3–5 person usability check (people Sean knows who are studying or recently tested), done in person or with friends and family. No public recruiting posts without Sean's approval.

**§12 Schedule**
- **Day 2 (Sean):** design tokens and type ramp in Figma, 2 hours.
- **Day 6 (Sean):** Proof sheet and Test Day wireframes.
- **Day 14 (Sean):** usability check.
- **Claude Code:** absorbs the Proof sheet in the Day 5–6 study-loop work, Sun Mode and accessibility on Day 14, and Test Day on Days 15–16. This is about +1.5 days of work [E]; take it from Day 20's buffer.

**§14 Risks, new**
- **R10:** a polished, no-ads rival (Hanh Le adding a cheaper lifetime, or the indie CDL Prep Ultimate). Mitigation: lead with proof and state depth, not design alone.
- **R11:** a source excerpt that drifts too close to manual text (copyright). Mitigation: a ≤240-character paraphrase rule plus the existing verbatim-copy check.

## 15. Tool spend (this task)
| Tool | Use | Cost |
|---|---|---|
| Apify `harshmaur/reddit-scraper` | 94 results, 1 start | about $0.21 [E, from list price: $0.002/result + $0.02/start] |
| Apify `supreme_coder/youtube-comment-scraper` | 100 comments | about $0.03 [E] |
| **Apify total** | | **about $0.24**, under the $0.75 cap. Exact billing wasn't read back. |
| Apple review feed, iTunes lookup, google-play-scraper, YouTube search page | | $0 |
| Mobbin | 8 searches | Per Sean's existing plan; no per-call charge shown |

## Files (`cdl-2026-10-28/ux/`)
- `reviews_new.json` and `reviews_all.json` (6,112 unique reviews)
- `handcode_sample.json`, `handcoded_356.csv`, `codes_b1-4.txt`, `handcode_summary.json`
- `keyword_ux_scan.json`
- `reddit_new.json`, `youtube_comments.json`
- `shots/*.jpg` (competitor screenshots, first 3 each) and `shots/meta.json`
- `pull.py`
