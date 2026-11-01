# Ron Delhaye Studios — Landscape Portfolio

Public portfolio site for Ron Delhaye's landscape photography.
Live: https://ron-delhaye-studios.github.io/ron-delhaye-studios/
Custom domain: https://thegoldenhour.photography/ — canonical address once DNS verifies.

- `index.html` — single-page gallery site (hero, gallery + lightbox, Collect, wall-preview teaser, About, footer)
- `images/full/` — 31 optimized images, max 1600px, for hero / lightbox / about
- `images/thumb/` — 31 thumbnails, max 800px, for the grid

Originals live in the photographer's Drive and `~/workspace/user/media_library/ron-landscapes/`.
All images: Photography by Ron Delhaye.

## Atelier build

WO-RDS-LUX-03 extends the merged luxury PR2 presentation with the Alpine Aperture
crest, vector favicon, three curated folios, 31-plate catalog and acquisition
concierge. See [implementation notes](docs/WO-RDS-LUX-03.md) for the source,
review considerations and validation scope.

- `data/plates-catalog.json` contains numbered plates, confirmed titles and permitted telemetry.
- `data/artist-titles.json` preserves 46 exact artist titles; `data/plate-title-matches.json` gates their assignment by verified source-sheet matches. See [the title handoff](docs/artist-title-registry.md).
- `assets/luxury.css` retains the PR2 foundation.
- `css/luxury-atelier.css` adds the atelier palette, plaque and collector form.
- `js/atelier-concierge.js` builds the catalog and manages filtering, viewer and
  prefilled email inquiries. The form requires an email app; it stores no data.
- `wall-preview/` provides spatial calibration with the existing room geometry.

Serve this directory over HTTP (for example `python3 -m http.server 8000`), as
the gallery loads its catalog with fetch. Run `npm ci`,
`npx playwright install chromium`, and `npm test` for browser validation. Run
`python -m unittest discover -s tests -p 'test_*.py'` and
`python scripts/sync_plate_titles.py --check` for the title-mapping boundary.
