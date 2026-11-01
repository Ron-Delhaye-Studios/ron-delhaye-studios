# WO-RDS-LUX-03 implementation notes

Source: [THALEIA 0041 — build and spec](https://docs.google.com/document/d/1gUEh_0sZd7N86TyyGNimhFGQIWxuPHLqrgHbxZtVBXw/edit), retrieved 2026-11-01. Original base: merged Studios luxury PR #2 (`ea4b85b`). Current changes extend owner-merged PR #3 and the Home Screen hotfixes.

The crest, vector favicon and 31 Working image paths come from 0041. Original image files are unchanged. `css/luxury-atelier.css` extends PR2 with the supplied SVG palette (obsidian #0B0C0E, ivory #F4EFE6, gold #C6A76A); 0041 names the stylesheet but supplies no CSS block. Styles/script/catalog/favicon retain `?v=nov2`.

Folio filters use native toggle buttons with `aria-pressed`. The lightbox preserves Escape, arrows, swipe, focus containment/restoration and an inert background. Inquiry restores scrolling and focuses the native acquisition drawer. Email dispatch prepares a structured mailto for the collector to review and send; there is no server-side registry or storage. The drawer explicitly requests the paper/signature/certificate/edition specifications required by LUNA's latest pickup.

## Current content gates

See [artist-title registry and handoff](artist-title-registry.md) for sources, ARTEMIS's exact delta, matching rules and remaining inputs. The 46 recovered artist titles are imported into a source-traceable title index. LUNA’s eligible registry entries now bind 15 plates; 16 remain numbered, including disputed plate 30 and the unresolved cabin pair. An explicit reviewed variant group permits plates 10/12 to share one artist source. The exact collection intro and Folio II correction are applied. ARTEMIS's six synthetic title alternatives are preserved as review history rather than published over the artist's titles.

Elevations for plates 26, 12, 18, 24 and 27 remain omitted. Inventory counts, generic master/PPI assertions, edition/price/allocations and bio/service claims remain held pending verification/owner confirmation. Original proposals are retained in `docs/curatorial-held-proposals.json`; runtime code does not load that file. Do not infer paper weight, archival lifespan, signature or certificate availability from the drawer's questions.

The About image uses the full JPEG's actual 1600w descriptor. Viewing-room geometry is preserved; assigning image sources only when changed avoids its prior load/render loop.

## Home Screen routing

Root `CNAME` contains `thegoldenhour.photography`. GitHub Pages deploys `main` at `/`. The root manifest launches `/` with scope `/`, and `/ron-delhaye-studios/` redirects old saved shortcuts to the custom-domain root while preserving query and fragment. Owner confirmed Home Screen launch working after the deployed hotfixes. These settings are preserved.

## Validation

Run `npm ci`, `npx playwright install chromium`, then `npm test`. Run `python -m unittest discover -s tests -p 'test_*.py' -v` and `python scripts/sync_plate_titles.py --check` for title mapping checks.

Current validation: **8/8 Playwright tests and 8/8 mapping tests pass**. Source image paths are checked over HTTP, every full-resolution plate is decoded, and desktop/mobile tests cover filtering, keyboard focus, inquiry prefill, encoded email questions, held-claim omission, Home Screen launch and no horizontal overflow. Axe scans the gallery, open plaque, open drawer and viewing room with WCAG 2.1 A/AA rules at 1440×1000 and 390×844: zero automated violations. Automated scans do not establish complete WCAG conformance. LUNA's physical iOS/desktop acceptance remains separate.

Gate: **NEEDS_RON_MERGE**. This follow-up is PR-only; no merge/deployment is authorized by a BUS status label.
