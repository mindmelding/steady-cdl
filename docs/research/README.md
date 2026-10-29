# Research index (all pulled Oct 28, 2026, read-only)
Each report has a `.md` (read this) and a matching `.pdf`. Raw paths inside the reports (`cdl-2026-10-28/...`) map to `data/` here; bulky scrape dumps, competitor screenshots and Mobbin images were left out on purpose.

## Reports
- `cdl-differentiation-2026-10-28.md`: 3,981 reviews + 178 Reddit items coded into what drivers hate/love, revenue estimates, industry trends (English-only tests, ELDT, ELP), wedge and MVP.
- `cdl-pricing-2026-10-28.md`: every competitor's listing, ads, free tier, subscriptions and lifetime prices vs our $14.99 / $4.99 / $19.99 / $34.98.
- `cdl-ux-differentiation-2026-10-28.md`: 343 hand-coded complaints, quotes, rival weaknesses, Mobbin UX patterns, signature experiences, brand direction.
- `cdl-moat-2026-10-28.md`: ranked moat stack, state-format differences, eCFR change rate, SEO/video distribution, 90-day roadmap, odds impact.
- `cdl-build-spec-v2-2026-10-28.md`: the full build spec v2 (data model, content pipeline, lint, milestones, stage gates, factory template). CLAUDE.md is the approved, newer summary of it; where they differ, CLAUDE.md wins.
- `law-search-appfigures-2026-10-28.md`: the earlier Appfigures niche scan that picked CDL as app #1 ("crowded but paying").

## Data (`data/`)
- `reviews/reviews_coded.csv`: 3,981 App Store + Google Play reviews with keyword theme codes (no reviewer names).
- `reviews/handcoded_356.csv`: 356 negative reviews hand-coded with 34 granular codes.
- `reviews/handcode_summary.json`: counts per hand code.
- `reviews/keyword_ux_scan.json`: UX-keyword counts over all 6,112 reviews (directional).
- `reviews/theme_counts.json`, `reviews/theme_unions.json`: theme tallies behind the differentiation report.
- `reviews/code_themes.py`: the keyword rules used to code themes.
- `pricing/competitors.csv`: 11 iOS rivals with IDs, Play IDs, ratings, ads flag and revenue estimate where measured.
- `pricing/ios_pricing.json`, `pricing/gp_pricing.json`, `pricing/gp_meta.json`: raw listing data (IAP lists, ads, descriptions, installs).
- `pricing/prices_iap.md`: the compact in-app price table.
- `seo/semrush_cdl_batch.csv`, `seo/semrush_15.csv`: Semrush US volumes, KD and trends for 23 keywords.
- `seo/seo-seed-pages.csv`: the 5 approved seed pages with their keyword data (ship days 22–25).
- `state-formats/state-formats-seed.csv`: every state-format fact found so far, with status (sourced / VERIFY) and source.
- `regulatory/ecfr_v_{172,383,391,392,393,397}.json`: eCFR versioner API responses (amendment dates per part); the starting point for the rule-change watch.
- `reddit/reddit_items.json`, `reddit/reddit_new.json`: 178 + 94 Reddit posts/comments (text, score, search term; no usernames).
- `model/cdl_moat_log.txt`: the odds-model run log behind `cdl-moat` §10.
