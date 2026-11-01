# Ron Delhaye Studios — Landscape Portfolio

Public portfolio site for Ron Delhaye's landscape photography.
Live: https://ron-delhaye-studios.github.io/ron-delhaye-studios/
Custom domain: https://thegoldenhour.photography/ — canonical address once DNS verifies.

- `index.html` — single-page gallery site (hero, gallery + lightbox, Collect, wall-preview teaser, About, footer)
- `images/full/` — 31 optimized images, max 1600px, for hero / lightbox / about
- `images/thumb/` — 31 thumbnails, max 800px, for the grid

Originals live in the photographer's Drive and `~/workspace/user/media_library/ron-landscapes/`.
All images: Photography by Ron Delhaye.

## Edit notes
- Collector-list signup is a `mailto:` placeholder (`studio@rondelhayestudios.com`) — replace with his real address.
- `#wall-preview` section is a coming-soon teaser; wire the interactive wall-preview module there when ready.

## Luxury presentation

`assets/luxury.css` maps THALEIA's 0029 §II.A to the existing portfolio and
wall-preview controls. The original Cormorant display face, all photography,
copy, collection terms, prices and destinations are preserved. Photographs have
quiet frames and always-visible numbered captions. The gallery viewer supports
keyboard activation, keeps focus inside its controls, and returns focus on close.
The wall preview receives the same palette and accessible control sizing without
changing its artwork geometry or reservation state.
