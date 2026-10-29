# CDL Prep Pricing Recheck: How We Compare
**Pulled Wed Oct 28, 2026, about 9:15–9:20 AM PT.** Sources: the public US App Store page for each app (its "In-App Purchases" list plus the "Contains Advertising" label), the iTunes lookup API (ratings, descriptions) and google-play-scraper (Play rating, installs, "Contains ads", IAP range, description). Raw data is in `cdl-2026-10-28/pricing/` (ios_pricing.json, gp_pricing.json, ios_*.html).

**Our pricing (Sean approved):** permit pack **$14.99** one-time, endorsements **$4.99 each** or **$19.99 all**, so **$34.98 for everything**. No ads, no subscription. We'll test $19.99 for the permit pack once reviews come in.

**Limits on this data:**
- Apple lists IAP names and prices but not always the period. When the name doesn't say the period, I left it as "unlabeled."
- Google Play shows only a price range. I didn't see the Play subscription periods.
- No purchases or sign-ins were made, so I didn't see in-app paywalls, which can differ from these lists.
- Estimates are marked *(est.)*.

## 1. Current listings (iOS ranked by rating count; Play counterpart where one exists)

| App (developer) | Store links | iOS rating (count) | Play rating (count), installs | Ads | Free tier | Subscriptions seen | One-time / lifetime | Endorsements in description |
|---|---|---|---|---|---|---|---|---|
| **CDL Test Prep 2026 Class A B** (Hanh Le) | [iOS](https://apps.apple.com/us/app/id1527903479) · Play: not found | 4.90 (48,612) | n/a | iOS: yes | Free with ads | Pass Pro weekly $6.99, monthly $19.99 | Remove Ads $5.99; 30-Day Pass $19.99; Lifetime $39.99 | HazMat, Tanker, Doubles/Triples, Passenger, School Bus, Air Brakes, Combination; Spanish mentioned |
| **CDL Exam Prep 2026** (Easy Pass) | [iOS](https://apps.apple.com/us/app/id1469003902) · [Play](https://play.google.com/store/apps/details?id=com.edupass.cdl) | 4.91 (27,615) | 4.90 (72), 1,000+ | iOS: yes. Play: no | iOS: basic tests free. Play: "100% free, no ads, no paywalls" | Weekly $9.99, monthly $19.99, quarterly $39.99, yearly $49.99 (iOS) | Lifetime $59.99 (iOS). Play shows no IAP | All 7 |
| **CDL Permit: Practice Test 2026** (Mapola) | [iOS](https://apps.apple.com/us/app/id1566343337) · Play: not found | 4.75 (18,167) | n/a | No | Free trial mentioned | Monthly with trial "Special Offer" $9.99; unlabeled $24.99 | Lifetime $99.99 | HazMat, Tanker, Passenger, School Bus, Air Brakes, Combination |
| **CDL Prep Test 2026** (Wei Zhang iOS / VZ INC APPS Play; I didn't confirm they're the same developer) | [iOS](https://apps.apple.com/us/app/id1464409838) · [Play](https://play.google.com/store/apps/details?id=com.bubblingiso.CDL) | 4.88 (15,363) | 4.92 (19,943), 500,000+ | Yes | Fully free with ads | None (no IAP listed) | None | No endorsements named in the description |
| **CDL Prep Practice Test Genie** (DMV Genie / Elegant eLearning) | [iOS](https://apps.apple.com/us/app/id1447415467) · [Play](https://play.google.com/store/apps/details?id=dto.ee.cdl.genius) | 4.78 (14,486) | 4.79 (3,084), 100,000+ | iOS: no. Play: yes | Limited free | Weekly $19.99; Premium 1-month $49.99; Class A 30-day $99.00; Class B 30-day $99.99; Non-ELDT endorsements 30-day $49.99 | "Genie Premium" $14.99 (period unlabeled); All-in-one $39.99 / $49.99 (unlabeled); Lifetime $99.99. Play range $19.99–$219.99 | All 7 |
| **CDL Prep Test 2026** (Khai Vuong; on Play as Nam Nguyen Unisoft) | [iOS](https://apps.apple.com/us/app/id1610099124) · [Play](https://play.google.com/store/apps/details?id=com.huyendt.cdl) | 4.72 (7,811) | 3.28 (249), 100,000+ | No | Free trial mentioned | "CDL Premium User" $9.99 / $19.99 / $48.99 (periods unlabeled) | "CDL Premium" $74.99 (probably lifetime, not confirmed). Play range $8.99–$74.99 | Play: all 7. iOS: Hazardous, Passenger |
| **CDL Prep** (Jeffrey Diaz) | [iOS](https://apps.apple.com/us/app/id1101536521) · [Play](https://play.google.com/store/apps/details?id=com.jeffreydiaz.android.app.cdlprep) | 4.68 (7,016) | 4.57 (5,747), 1,000,000+ | Yes | Fully free with ads | None | None | HazMat, Doubles/Triples, Passenger, School Bus, Air Brakes, Combination (no Tanker named) |
| **CDL Practice Test® 2026** (The PATG Group) | [iOS](https://apps.apple.com/us/app/id1441336161) · Play: not found | 4.84 (6,123) | n/a | Yes | Practice bank, explanations and 50-state manuals are free. Only Exam Mode is paid | Monthly $17.99; yearly $99.00; "CDL Prep" $4.99 (unlabeled, likely weekly *(est.)*) | None | All 7. Says it cites the FMCSA manual on every question |
| **CDL Prep – Practice Test 2026** (Best Fun Games) | [iOS](https://apps.apple.com/us/app/id6446039122) · [Play](https://play.google.com/store/apps/details?id=com.bestfungames.cdl) | 4.64 (3,367) | 4.62 (14,862), 100,000+ | No | Limited free. Earlier today's page showed a 1-week free trial | Monthly $24.99; annual $59.99 | Lifetime $59.99 / $74.99 / $89.99. Play range $24.99–$89.99 | Hazardous, Passenger, Air Brakes, Combination |
| **CDL Prep Practice Test – 2026** (Solvely / Aignite) | [iOS](https://apps.apple.com/us/app/id6752642386) · iOS only | 4.83 (2,521) | n/a | No | Limited free | Weekly $11.99; monthly $15.99 / $19.99 | 1-Month Access $19.99 / $24.99; Lifetime $69.99 | All 7; Spanish |
| **CDL Practice Test Prep 2026** (BrainSoft / Genioworks) | [iOS](https://apps.apple.com/us/app/id6785859349) · [Play](https://play.google.com/store/apps/details?id=com.brainsoft.apps.cdl) | 4.90 (10) | 4.68 (507), 10,000+ | Yes | Limited free | Weekly $2.99 / $9.99; yearly $39.99. Play range $2.49–$34.99 | None seen | All 7 |

**Other Play apps checked:**
- [CDL Practice Written Test](https://play.google.com/store/apps/details?id=com.dmvwrittentest.android.cdl) (DMV Written Test): 4.64 (4,650), 100,000+ installs, ads, IAP $10.99–$17.99.
- [CDL Test Prep](https://play.google.com/store/apps/details?id=com.vialsoft.cdlusafreemium) (Vialsoft): 4.49 (2,617), 500,000+ installs, ads, IAP $4.99.
- [CristCDL.com](https://play.google.com/store/apps/details?id=com.cristcdl.practicetests): 4.52 (113), 10,000+ installs, ads, no IAP.
- [CDL Pass](https://play.google.com/store/apps/details?id=io.quantumpotato.cdlpass): 4.85 (253), ads, no IAP.
- [HLT Official CDL Iowa](https://play.google.com/store/apps/details?id=com.hltcorp.cdl) covers Iowa only: $4.99/mo or $19.99/yr per its description; Play range $6.99–$23.99.

## 2. What a student pays for full access

The 1-month and 3-month columns use the cheapest full-access path I could see. With every competitor, all endorsements come with the subscription, so "permit + all endorsements" costs the same as the study period. A paid period ends and features lock again; ours never expire.

| App | 1 month | 3 months | Lifetime / own it | vs our $14.99 permit | vs our $34.98 everything |
|---|---|---|---|---|---|
| **Ours** | **$14.99** permit only / **$34.98** all | same (no expiry) | same | — | — |
| Hanh Le | $19.99 (Pro or 30-Day Pass); $5.99 removes ads only | $39.99 lifetime | $39.99 | We're $5 cheaper | **We're $5.01 cheaper** |
| Easy Pass (iOS) | $19.99 | $39.99 quarterly | $59.99 | We're $5 cheaper | We're $5.01 cheaper over 3 months, $25 below its lifetime |
| Mapola | $9.99 "special offer" monthly; otherwise $24.99 (unlabeled) | $29.97 *(est., 3× $9.99)* | $99.99 | **We cost more** if the $9.99 offer is real and repeats | **We cost more** over 3 months ($29.97); $65 cheaper than its lifetime |
| DMV Genie | $49.99 Premium month ($14.99 "Genie Premium" has no period shown) | $99.99 lifetime is cheapest | $99.99 | We're $35 cheaper | We're $65 cheaper |
| Khai Vuong | $9.99–$19.99 *(periods unlabeled)* | likely $48.99 *(est.)* | $74.99 *(likely)* | Unclear | We're about $14–40 cheaper *(est.)* |
| PATG | $0 practice; $17.99 for Exam Mode | $53.97 *(est., 3× monthly)* | none; $99/yr | We cost more than free practice; $3 cheaper than Exam Mode | We're $19 cheaper over 3 months |
| Best Fun Games | $24.99 | $59.99 (annual or lifetime) | $59.99 | We're $10 cheaper | We're $25.01 cheaper |
| Solvely | $15.99 | $47.97 *(est., 3× $15.99)* | $69.99 | We're $1 cheaper | We're $13 cheaper over 3 months, $35 below its lifetime |
| BrainSoft | about $12.86 at $2.99/week *(est.; may be an intro rate)*, or $42.96 at $9.99/week | $39.99 yearly | none | **Possibly we cost more** at the $2.99 rate | We're $5.01 cheaper |
| Jeffrey Diaz / Wei Zhang-VZ / CristCDL / CDL Pass | $0 with ads | $0 | $0 | **We cost more** | **We cost more** |
| Easy Pass (Play) | $0, no ads, per its description | $0 | $0 | **We cost more** | **We cost more** |

## 3. Verdict

- **Cheaper than nearly every paid, ad-free full-access option.** At $14.99 the permit pack undercuts every standard 1-month price I could confirm ($15.99–$49.99). At $34.98 the full bundle is below every lifetime price seen ($39.99–$99.99) and below most 3-month costs ($39.99–$99.99).
- **Not much cheaper than the strongest rival.** Hanh Le has the most ratings in the category (48.6k at 4.9). It's free with ads, offers a $5.99 one-time ad removal, and has a $39.99 lifetime. That's only $5 above our full bundle and it includes every endorsement plus an AI tutor. Price alone won't beat it.
- **Where we cost more:**
  - The free ad-supported apps: Jeffrey Diaz (1M+ Play installs), VZ (19.9k Play ratings at 4.92), CristCDL and CDL Pass.
  - PATG's free practice bank.
  - Easy Pass on Play, which is free with no ads (but small: 72 ratings).
  - Possibly Mapola's $9.99 monthly offer and BrainSoft's $2.99 weekly.
  - Hanh Le's $5.99 remove-ads for someone who only wants ad-free basic practice.
- **"No subscription" is our clearest difference.** Nine of the 11 iOS apps sell auto-renewing plans, and several have weekly plans ($2.99–$19.99/week) or 30-day passes that cost $49.99–$99.99 (DMV Genie). One fair price with no expiry still sets us apart.
- **"No ads" is only a partial difference.** Mapola, DMV Genie (iOS), Best Fun Games, Khai Vuong and Solvely are already ad-free (they sell subscriptions instead). The free apps are the ones with ads.
- **"Accuracy" is already being claimed.** PATG says every question cites the FMCSA manual and calls itself "not a clone." Hanh Le has a "Report mistake" button and says its bank is updated for the 2026 handbook. To make accuracy believable we need more than the claim: cite the state manual section on every question, show a "last verified" date, and lead with HazMat and state-specific depth (from the Task 1 research).
- **Recommendation:** keep the $14.99 / $4.99 / $19.99 launch pricing. Market it as "$34.98 once, everything, forever. No ads, no auto-renew" next to the $19.99/month and $39.99–$99.99 lifetime norms.
  - Offer some free practice (for example one free test per section). Most of the top apps have a free tier and the very top ones are fully free, so a hard paywall would lose the install comparison.
  - Testing $19.99 later is reasonable. The full bundle would then be $39.98, roughly level with Hanh Le's lifetime and still under Easy Pass, Solvely, Best Fun Games, DMV Genie and Mapola.
