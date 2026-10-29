# Design files
- `final/`: **use these.** Logo lockups (horizontal, stacked, icon, mark-only; black-on-white and white-on-black; SVG with outlined text + 2x PNG), app icons (`app-icon-1024/180/60/29.png`; ≤64 px uses the small-optimized mark), `steady-cdl-brand-guide.pdf/.png`.
- `png/`: the 10 v2 screen mocks (393×852 pt at 2x) + `contact-sheet-v2.png`. Layout source of truth. **All content in them is sample content**; manual section numbers like "§5.x" are placeholders.
- `store/`: App Store screenshots 1–3 (1290×2796). Drafts: remove the "Draft · sample content" footer and swap in verified content before upload.
- `icon/`: earlier icon exports and the home-screen legibility mock. `wordmarks/`: an early wordmark sheet (superseded by `final/`).
- `mobbin/references.md`: Mobbin links and what we borrow (no images).
- `src/`: the Python + HTML that renders everything (headless Chrome screenshots).

## Re-rendering (optional; you don't need this to build the app)
Needs Python 3, headless Chrome, `fonttools` + `uharfbuzz` (for `final.py`), and the fonts Inter, Atkinson Hyperlegible and IBM Plex Mono installed.
```bash
export CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # macOS
export INTER_VF="/path/to/Inter-VariableFont_opsz,wght.ttf"                    # for final.py
cd design && python3 src/icon.py && python3 src/final.py && python3 src/build_v2.py && python3 src/store.py && python3 src/guide.py
```
`build_v2.py` writes `png/` + the contact sheet, `store.py` the store screenshots, `final.py` the lockups and icons, `guide.py` the brand guide. The HTML files in `src/` are the generated pages; edit the `.py` files, not the HTML.
