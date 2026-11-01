const {test,expect} = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../data/plates-catalog.json');
async function accessible(page) {
  const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
}
async function imagesLoad(page) {
  await page.locator('img').evaluateAll(async images => {
    await Promise.all(images.filter(i => i.getAttribute('src')).map(i => {i.loading='eager';return i.decode();}));
  });
  expect(await page.locator('img[src]:not([src=""])').evaluateAll(images => images.filter(i => !i.complete || !i.naturalWidth).map(i => i.src))).toEqual([]);
}
test('catalog preserves all source plates and static image references',async ({request}) => {
  expect(catalog.plates).toHaveLength(31);
  expect(new Set(catalog.plates.map(p => p.file)).size).toBe(31);
  expect(catalog.plates.some(p => Object.hasOwn(p,'remaining'))).toBeFalsy();
  for (const plate of ['12','18','24','26','27']) expect(catalog.plates.find(p => p.plate===plate).elevation).toBeNull();
  expect(JSON.stringify(catalog)).not.toContain('300 PPI');
  expect(catalog).not.toHaveProperty('masterResolution');
  expect(catalog).not.toHaveProperty('editionStandard');
  expect(catalog.tiers.every(t => !Object.hasOwn(t,'price') && !Object.hasOwn(t,'allocation'))).toBeTruthy();
  const paths = new Set();
  for (let i=1;i<=31;i++) for (const dir of ['full','thumb']) paths.add(`images/${dir}/Working-${i}.jpg`);
  for (const file of ['index.html','wall-preview/index.html','manifest.json','wall-preview/wall-preview-assets/manifest.json']) {
    const source = fs.readFileSync(file,'utf8');
    for (const match of source.matchAll(/(?:src|href)="([^"?#]+\.(?:jpg|png|webp|svg))|"src":\s*"([^"]+)"/g)) paths.add(path.posix.normalize(path.posix.join(path.posix.dirname(file),match[1]||match[2])));
  }
  for (const file of paths) {
    expect(fs.existsSync(file),file).toBeTruthy();
    expect((await request.get('/'+file)).ok(),file).toBeTruthy();
  }
});
test('folios, plaque, keyboard lifecycle, inquiry and AA scans',async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.tile')).toHaveCount(31);
  await imagesLoad(page);await accessible(page);
  await expect(page.locator('body')).not.toContainText(/museum transit|Tru Vue|Optium|private commissions|permanently toward|certificate of authenticity/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  for (const folio of catalog.folios) {
    await page.locator(`[data-folio="${folio.id}"]`).click();
    await expect(page.locator('.tile:visible')).toHaveCount(catalog.plates.filter(p=>p.folio===folio.id).length);
  }
  await page.locator('[data-folio="II"]').click();
  const first = page.locator('.tile:visible').first();
  await first.focus();await page.keyboard.press('Enter');
  await expect(page.locator('#plaque-title')).toHaveText('Plate 03');
  await imagesLoad(page);await accessible(page);
  await expect(page.locator('#lbClose')).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(page.locator('#plaque-inquire-btn')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('#lbClose')).toBeFocused();
  await page.keyboard.press('ArrowLeft');await expect(page.locator('#plaque-title')).toHaveText('Plate 29');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');await expect(first).toBeFocused();
  // Exercise every full-resolution plate without renaming or replacing source files.
  await page.locator('[data-folio="all"]').click();
  await page.locator('.tile').first().click();
  for (const plate of catalog.plates) {
    await expect(page.locator('#plaque-title')).toHaveText(plate.title);
    await expect(page.locator('.spec-plaque')).not.toContainText(/remaining|300 PPI|Archival Master|Limited Edition of 25|\$2,400|\$4,800|\$9,500|undefined|null/);
    const heldElevations = {'12':'10,800 FT','18':'10,114 FT','24':'11,200 FT','26':'11,500 FT','27':'11,520 FT'};
    if (heldElevations[plate.plate]) await expect(page.locator('#plaque-telemetry')).not.toContainText(heldElevations[plate.plate]);
    await page.locator('#lbImg').evaluate(i=>i.decode());
    await page.locator('#lbNext').click();
  }
  await page.locator('#plaque-inquire-btn').click();
  await expect(page.locator('#concierge-drawer')).toHaveAttribute('open','');
  await expect(page.locator('#inquiry-plate-input')).toHaveValue('Plate 01');
  await expect(page.locator('#inquiry-plate-input')).toBeFocused();
  expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
  expect(await page.locator('[inert]').count()).toBe(0);
  await accessible(page);
  await page.locator('#collector-name').fill('Indy & Collector');
  await page.locator('#collector-email').fill('collector@example.com');
  await page.locator('#inquiry-scale').selectOption({label:'II. Gallery Standard · 40 × 60 in'});
  const emailRequest=page.waitForEvent('request',r=>r.url().startsWith('mailto:'));
  await page.locator('#collector-form button').click();
  const email=decodeURIComponent((await emailRequest).url());
  expect(email).toContain('Collector Email: collector@example.com');
  expect(email).toContain('Plate 01');
  expect(email).toContain('II. Gallery Standard · 40 × 60 in');
  for (const detail of ['Substrate / paper class','Paper weight in gsm','Archival lifespan rating','Hand-signature detail','Certificate of Authenticity and its matching registry ID','Edition policy, current price']) expect(email).toContain(detail);
  expect(errors).toEqual([]);
});
test('private viewing room images and AA scan',async ({page}) => {
  await page.goto('/wall-preview/');
  await expect(page.locator('#artThumbs button')).toHaveCount(3);
  await imagesLoad(page);await accessible(page);
  for (const button of await page.locator('#roomThumbs button').all()) {await button.click();await imagesLoad(page);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});


test('Home Screen launch uses the custom-domain root and old shortcuts recover', async ({page,request}) => {
  await page.goto('/');
  const manifestURL = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifest = await (await request.get(manifestURL)).json();
  expect(manifest.start_url).toBe('/');
  expect(manifest.scope).toBe('/');
  await page.goto(manifest.start_url);
  await expect(page.locator('.tile')).toHaveCount(31);
  const legacy = await request.get('/ron-delhaye-studios/');
  expect(legacy.status()).toBe(200);
  expect(await legacy.text()).toContain('url=https://thegoldenhour.photography/');
});
