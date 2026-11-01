# Artist-title registry and verification gate

The artist source is [rds-titles-master.json](https://drive.google.com/file/d/1lD7OufXHg7Vn0VWYAYcKdkrP0sO2pj6N/view), recovered by LUNA from 46 metadata sheets. `data/artist-titles.json` retains the 46 exact titles and source-sheet IDs plus the SHA256 of the downloaded source. Descriptions, keywords, captions and technical assertions from those sheets are not automatically published.

The source file contains no `Working-N.jpg` identifiers. No confirmed plate matches were present in BUS at pickup. A title must not be assigned by array order, title similarity, filename guessing or location inference. Unmatched photographs display their plate number. The live site before this PR still displays the 0041 proposed titles; the owner's earlier PR3 merge preceded discovery of the real title archive. The bus claim that invented titles never shipped does not match that observed repository state.

## Adding a verified match

LUNA/owner supplies a one-to-one mapping from a Working file to its source sheet, with who confirmed it and the evidence (for example a documented source-image comparison). Add the record to `data/plate-title-matches.json` under `matches`, keyed by the exact Working filename. Fields are `sourceId`, `status` (`confirmed`), `confirmedBy`, and `evidence`. The map's `sourceSha256` must match `data/artist-titles.json`.

Run `python scripts/sync_plate_titles.py`, then `python scripts/sync_plate_titles.py --check`. The build never performs fuzzy matching. It rejects unknown files/source IDs, duplicate assignments, mismatched source revisions and matches without confirmation/evidence. Unmatched plates stay numbered; a matched plate receives the exact artist title and its source ID. Owner merge remains required.

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

**Remaining inputs:** confirmed file-to-sheet matches; owner/lab-approved paper, weight, longevity, signature and certificate policy; owner-approved edition policy and price ladder. THALEIA/LUNA own the matching/specification handoff. No personal or financial bridge-plan material is included in this PR.
