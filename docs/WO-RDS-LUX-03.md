# WO-RDS-LUX-03 implementation notes

Source: [THALEIA 0041 — build and spec](https://docs.google.com/document/d/1gUEh_0sZd7N86TyyGNimhFGQIWxuPHLqrgHbxZtVBXw/edit), retrieved 2026-11-01.
Base: merged Studios luxury PR #2 (`ea4b85b`).

- Crest and favicon SVGs and the base 31-plate catalog are taken from the source document. Original Working-1.jpg through Working-31.jpg files are unchanged.
- `css/luxury-atelier.css` extends PR2 using the supplied SVG palette (obsidian #0B0C0E, ivory #F4EFE6, gold #C6A76A). The source names this stylesheet but supplies no CSS block; the layout rules are implemented here.
- Folio filters use native toggle buttons with `aria-pressed`, because these filter one shared gallery rather than switching tab panels. All filters remain keyboard accessible.
- The plaque displays catalog details with ARTEMIS’s holds applied (see below). Other supplied editorial/commercial assertions still require owner review before merge.
- Acquisition opens a native details drawer, prefills the selected plate, and prepares the specified structured mailto email. The collector must review and send it in an email app. There is no server-side registry or submission storage.
- Lightbox controls preserve Escape, arrow navigation, swipe, focus containment and focus restoration. Background content is inert while the viewer is open; inquiry restores page scrolling before focusing the form.
- The About responsive image includes the original full JPEG with its actual 1600w descriptor. The source requests 2000w, but that descriptor would misstate the unchanged file's pixel width.
- Both pages reference styles and the vector favicon with `?v=nov2`; the main page script and catalog request use the same cache version.

## Validation

Run `npm ci`, `npx playwright install chromium`, then `npm test`.
The suite checks source paths over HTTP, all 31 full-resolution plates, filtered navigation, keyboard focus, the inquiry handoff and encoded email fields. It scans the main gallery, open plaque, open collector form and private viewing room with axe WCAG 2.1 A/AA rules at desktop (1440×1000) and mobile (390×844) sizes.

Automated accessibility results do not establish complete WCAG conformance. LUNA's physical iOS/desktop acceptance and Master Indy's merge review remain required by the work order (`NEEDS_RON_MERGE`).

Validated 2026-11-01: **6/6 Playwright tests passed** in Chromium. Zero broken image paths, zero axe WCAG 2.1 A/AA violations in the tested states, and no horizontal overflow at either tested viewport. Desktop/mobile hero and plaque screenshots were inspected. The viewing room's existing image-load render loop was repaired by assigning image sources only when changed; geometry is preserved.


## ARTEMIS curatorial delta — 2026-11-01

Evidence: OBSERVED (0041), live-checked (plate 26, Maroon Lake), INFERRED (rest), as relayed by MASTER INDY and LUNA’s bus message `BUS-20261101-LUNA-CODEX-RDS-LUX-03-CURATORIAL-DELTA`.

Applied holds:
- Elevations for plates 26, 12, 18, 24 and 27 are null in the active catalog and omitted from the plaque pending verification. No replacement elevations have been inferred.
- All remaining inventory counts are removed from the active catalog and plaque pending owner confirmation.
- The 300 PPI assertion is removed from the active catalog and plaque pending owner confirmation.
- Bio and service claims (including metadata, signed/certificate promises, framing materials/glazing, transit specifications, service area and installation readiness) are replaced with neutral inquiry copy pending owner confirmation.
- Original held proposals are preserved for review in `docs/curatorial-held-proposals.json`; runtime code does not load that file.

Still pending exact editorial text: five title edits, collection intro rewrite, and the “fourteeners” correction. The Drive spec and bus relay provide categories only, without replacement strings. LUNA has already requested the verbatim delta from ARTEMIS (`BUS-20261101-LUNA-ARTEMIS-RDS-LUX-03-DELTA-TEXT`). Existing title/intro text is not presented as ARTEMIS-approved. Plate 26’s proposed location (West Maroon Pass) also needs reconciliation with ARTEMIS’s Maroon Lake observation; no location correction is inferred from the summary.

Gate remains **NEEDS_RON_MERGE**, with the exact editorial delta and LUNA’s physical-device acceptance outstanding.

Curatorial-hold regression validation: **6/6 tests passed** after the holds, including all five omitted elevations and absence of inventory counts, 300 PPI and the held bio/service wording. Zero broken image paths and zero automated WCAG 2.1 A/AA violations remain in the tested states.
