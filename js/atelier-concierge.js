(() => {
  'use strict';
  const grid = document.getElementById('grid');
  const status = document.getElementById('gallery-status');
  const lb = document.getElementById('lb');
  const image = document.getElementById('lbImg');
  const drawer = document.getElementById('concierge-drawer');
  let catalog, visible = [], current = 0, returnFocus;
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  function open(index) {
    const entering = !lb.classList.contains('open');
    if (entering) returnFocus = document.activeElement;
    current = (index + visible.length) % visible.length;
    const plate = visible[current];
    image.src = 'images/full/' + plate.file;
    image.alt = `${plate.title} — ${plate.location}. Photography by Ron Delhaye`;
    text('lbCount', `${current + 1} / ${visible.length}`);
    text('plaque-number', 'Plate ' + plate.plate);
    text('plaque-title', plate.title);
    text('plaque-telemetry', [plate.location, plate.elevation, plate.aspect].filter(Boolean).join(' · '));
    text('plaque-edition', catalog.editionStandard);
    text('plaque-master', catalog.masterResolution);
    text('plaque-scales', catalog.tiers.map(t => `${t.dimensions} · ${t.allocation} · ${t.price === null ? 'Price on request' : new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(t.price)}`).join(' / '));
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    for (const el of document.querySelectorAll('body > :not(.lb):not(script)')) el.inert = true;
    if (entering) document.getElementById('lbClose').focus();
  }
  function close(restore = true) {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    for (const el of document.querySelectorAll('body > [inert]')) el.inert = false;
    if (restore) returnFocus?.focus();
  }
  document.getElementById('lbClose').onclick = () => close();
  document.getElementById('lbPrev').onclick = () => open(current - 1);
  document.getElementById('lbNext').onclick = () => open(current + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
    if (e.key === 'Tab') {
      const buttons = [...lb.querySelectorAll('button')];
      const first = buttons[0], last = buttons.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let touchX = 0;
  document.querySelector('.lb-frame').addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
  document.querySelector('.lb-frame').addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) open(current + (delta < 0 ? 1 : -1));
  }, {passive:true});
  document.getElementById('plaque-inquire-btn').onclick = () => {
    const plate = visible[current];
    close(false);
    drawer.open = true;
    document.getElementById('inquiry-plate-input').value = `Plate ${plate.plate} — ${plate.title}`;
    drawer.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'center'});
    document.getElementById('inquiry-plate-input').focus({preventScroll:true});
  };
  const filters = [...document.querySelectorAll('[data-folio]')];
  filters.forEach(button => button.addEventListener('click', () => {
    if (!catalog) return;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const folio = button.dataset.folio;
    visible = catalog.plates.filter(p => folio === 'all' || p.folio === folio);
    for (const card of grid.children) card.hidden = folio !== 'all' && card.dataset.plateFolio !== folio;
    status.textContent = `${visible.length} plates · ${folio === 'all' ? 'The complete collection' : catalog.folios.find(f => f.id === folio).subtitle}`;
  }));
  fetch('data/plates-catalog.json?v=nov2').then(response => {
    if (!response.ok) throw new Error('Catalog unavailable');
    return response.json();
  }).then(data => {
    catalog = data; visible = data.plates;
    data.plates.forEach(plate => {
      const card = document.createElement('button');
      card.type = 'button'; card.className = 'tile'; card.dataset.plateFolio = plate.folio;
      card.setAttribute('aria-label', `Inspect Plate ${plate.plate} — ${plate.title}`);
      const img = document.createElement('img');
      img.src = 'images/thumb/' + plate.file; img.alt = `${plate.title} — ${plate.location}`; img.loading = 'lazy';
      const label = document.createElement('span'); label.className = 'num'; label.textContent = `Plate ${plate.plate} · ${plate.title}`;
      card.append(img, label);
      card.onclick = () => open(visible.indexOf(plate));
      grid.append(card);
    });
    filters[0].click();
  }).catch(() => {
    status.textContent = 'The plate registry could not load. Please reload or contact studio@rondelhayestudios.com.';
  });
  document.getElementById('collector-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const plate = data.get('plate') || 'General Collection';
    const subject = `Private Acquisition Inquiry — ${plate} (${data.get('name')})`;
    const body = `RON DELHAYE STUDIOS · PRIVATE ACQUISITION DESK\n----------------------------------------------\nCollector Name: ${data.get('name')}\nCollector Email: ${data.get('email')}\nSelected Plate: ${plate}\nArchitectural Scale: ${data.get('scale')}\n\nPlease forward the private dossier and edition availability for the work above.`;
    window.location.href = `mailto:studio@rondelhayestudios.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  document.addEventListener('contextmenu', e => { if (e.target.closest('img')) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (e.target.closest('img')) e.preventDefault(); });
})();
