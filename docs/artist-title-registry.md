# Artist-title registry and verification gate

The artist source is [rds-titles-master.json](https://drive.google.com/file/d/1lD7OufXHg7Vn0VWYAYcKdkrP0sO2pj6N/view), recovered by LUNA from 46 metadata sheets. `data/artist-titles.json` retains the 46 exact titles and source-sheet IDs plus the SHA256 of the downloaded source. Descriptions, keywords, captions and technical assertions from those sheets are not automatically published.

The artist source file contains no `Working-N.jpg` identifiers. Owner-merged PR #4 established numbered labels pending verified matches. LUNA's later visual registry now supports 15 plate assignments; 16 remain numbered. A title must not be assigned by array order, filename guessing or location inference.

## Adding a verified match

LUNA/owner supplies a mapping from a Working file to its source sheet, with who confirmed it and the evidence (for example a documented source-image comparison). A source sheet normally maps to one plate; a documented variant group is the only exception. Add the record to `data/plate-title-matches.json` under `matches`, keyed by the exact Working filename. Fields are `sourceId`, `status` (`confirmed`), `confirmedBy`, and `evidence`. The map's `sourceSha256` must match `data/artist-titles.json`.

Run `python scripts/sync_plate_titles.py`, then `python scripts/sync_plate_titles.py --check`. The build never performs fuzzy matching. It rejects unknown files/source IDs, undocumented duplicate assignments, mismatched source revisions, provisional/contested registry confidence and matches without confirmation/evidence. Shared-source variants require an explicit group with the exact file set, source ID, reviewer and evidence; partial or mismatched groups fail. Unmatched plates stay numbered; a matched plate receives the exact artist title and its source ID. Owner merge remains required.

## ARTEMIS verbatim delta

Source: `BUS-20261101-ARTEMIS-a73c8a53`. ARTEMIS corrected the earlier count from five to **six** title edits:

| Plate | Original proposed title | ARTEMIS reviewed draft |
| --- | --- | --- |
| 04 | Aurelia in the Canopy | Under the Canopy |
| 17 | Crown of the Sopris | Crown of Sopris |
| 18 | Solitude in 4:3 | The Long Quiet |
| 19 | Drift of the Fallen Gold | Drift, Fryingpan |
| 26 | Shadow & Sovereign Gold | Gold in Shadow |
| 28 | The Golden Corridor | The Corridor |

These draft alternatives are retained in `docs/curatorial-held-proposals.json`. LUNA's later pickup (`BUS-20261101-LUNA-CODEX-PICKUP`) makes the artist's recovered titles authoritative. The six synthetic alternatives are therefore review history, not replacements for unmatched artist titles.

Applied verbatim:

- Folio II subtitle: “High basins beneath the fourteeners, waking in the first minutes of gold.”
- Collection intro: “Thirty-one plates from the Colorado high country: aspen groves at peak autumn gold, high basins beneath the fourteeners, and the brief window when the land ignites. Select a plate for edition details and scale.”

ARTEMIS's later review (`BUS-20261101-ARTEMIS-a816d830`, sent to LUNA) extends the master and edition holds. The generic 12,000 × 16,000 / archival-master assertion, edition-of-25 statement, allocations and unapproved price ladder are omitted from collector presentation. They are retained as review proposals, not silently approved. Existing elevation/inventory/bio/service holds remain. No captions, megapixel/composite claims or time-of-day assertions have been imported from the recovered sheets.

## Print-provenance requirement

The drawer and prepared email now explicitly ask for substrate/paper class (including museum rag / archival pigment terminology), gsm paper weight, archival lifespan rating and test basis, hand-signature detail, and a Certificate of Authenticity with a matching registry ID. They also request edition policy, price and available scale. These are questions for the studio, not assertions that a specific paper, lifespan, signature or certificate is offered.

**Remaining inputs:** the 16 unresolved file-to-sheet matches; owner/lab-approved paper, weight, longevity, signature and certificate policy; owner-approved edition policy and price ladder. THALEIA/LUNA own the matching/specification handoff. No personal or financial bridge-plan material is included in this PR.


## LUNA verified match import — 2026-11-01

BUS source: `BUS-20261101-LUNA-CODEX-PLATE-MATCHES`. Drive source: [plate-match-registry.json](https://drive.google.com/file/d/1rxsW6ItQHh0dAk66HsI7C7tf76ZJjCu1/view), SHA256 `4d06aeb29d65c3362fa1735bca7222c80aa5c68a2380849f28ef63367093a332`. Exact downloaded bytes are retained in `docs/plate-match-evidence.json`; runtime code does not load that review file.

Only source entries with exact confidence `CONFIRMED` or `STRONG` are bound. These mean LUNA's visual verification, not owner approval or independent CODEX verification. The source-sheet IDs resolve to exact artist titles; two straight/curly apostrophe differences in LUNA's title strings were reconciled to the artist source (`Light’s Golden Embrace`, `Autumn’s Radiance`), without changing the artist's wording.

| Plate | Artist title | LUNA registry confidence |
| --- | --- | --- |
| 09 | Light’s Golden Embrace | STRONG |
| 10 | Autumn’s Radiance | STRONG |
| 12 | Autumn’s Radiance | STRONG |
| 14 | Radiance Along the Stream | STRONG |
| 15 | Autumn's Crimson Passage | CONFIRMED |
| 16 | Valley of Gold | STRONG |
| 17 | Crystal Reflections of Gold | CONFIRMED |
| 18 | Hidden Glow in the Forest | STRONG |
| 19 | Autumn Symphony at the Lake | STRONG |
| 20 | Golden Sanctuary | CONFIRMED |
| 21 | Golden Pastures Beneath the Peaks | STRONG |
| 22 | Golden Light Beneath the Peaks | STRONG |
| 24 | Path to Alpine Splendor | STRONG |
| 29 | Golden Pathway Through Aspen Grove | STRONG |
| 31 | Whispers of Autumn's Light | STRONG |

Plates 10 and 12 explicitly share the same artist source as a reviewed variant pair. `variantGroups.luna-variants-10-12` names both exact files and retains LUNA's scene evidence. No other duplicate source assignment is allowed implicitly.

**Held conflict:** the BUS summary lists W30 / “Path to the Summit” as strong, but the source registry marks it `STRONG — CONTESTED by Twilight Over the Golden Glade`, with a separate `CONTESTED` alternate claimant. The registry's rules reserve contested cases for Ron. Plate 30 therefore remains numbered until LUNA/Ron provides a reconciled assignment. The cabin pair 27/28 also remains numbered because the registry explicitly reserves its title split for Ron.

**Numbered plates:** 01, 02, 03, 04, 05, 06, 07, 08, 11, 13, 23, 25, 26, 27, 28, 30. Creek-family provisionals, low-confidence/one-of-two candidates and panoramas are not bound.

No captions, descriptions, location/elevation corrections, resolution/composite claims, time-of-day assertions or commercial terms are imported by this title-only match operation. Existing telemetry is not certified by a title association. All earlier claim/price/production holds remain.
