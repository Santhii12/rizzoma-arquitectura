// Smoke test de la experiencia móvil con WebKit (motor de Safari).
// Ejecutar tras npm run build y con el paquete playwright instalado.
import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, symlink } from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:4321/rizzoma-arquitectura/';
// Simula exactamente el prefijo publicado de GitHub Pages, incluso para imágenes y CSS.
await mkdir('mobile-preview', { recursive: true });
try {
  await symlink('../dist', 'mobile-preview/rizzoma-arquitectura', 'dir');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
}
const server = spawn('python3', [
  '-m', 'http.server', '4321', '--bind', '127.0.0.1', '--directory', 'mobile-preview'
], { stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '';
server.stdout.on('data', chunk => { logs += String(chunk); });
server.stderr.on('data', chunk => { logs += String(chunk); });
let browser;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  let reachable = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error('No se inició Astro preview: ' + logs);
    try {
      const response = await fetch(origin);
      if (response.ok) { reachable = true; break; }
    } catch { /* El servidor aún está arrancando. */ }
    await sleep(500);
  }
  assert.ok(reachable, 'La página no se pudo abrir: ' + logs);
  browser = await webkit.launch({ headless: true });
  await mkdir('mobile-artifacts', { recursive: true });

  for (const width of [375, 390, 430, 844]) {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
      viewport: { width, height: width > 600 ? 390 : 844 }
    });
    const page = await context.newPage();
    await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const visual = page.locator('.rizzoma-offer__featured-visual');
    const imageLocator = visual.locator('img');
    if (width === 375) {
      const css = await page.locator('link[rel="stylesheet"]').evaluateAll(nodes =>
        nodes.map(node => node.href));
      const checks = [];
      for (const resource of [...css.slice(0, 4), new URL('images/studio/home/rizzoma-hero-portada.webp', origin).toString()]) {
        const response = await page.request.get(resource);
        checks.push({ resource, status: response.status(), contentType: response.headers()['content-type'] });
      }
      console.log('ASSETS ' + JSON.stringify(checks));
      console.log('DOCUMENT ' + JSON.stringify(await page.evaluate(() => ({
        title: document.title,
        stylesheets: document.styleSheets.length,
        htmlBackground: getComputedStyle(document.body).backgroundColor,
        firstLink: document.querySelector('link[rel="stylesheet"]')?.getAttribute('href')
      }))));
    }
    // La imagen tiene loading=lazy; hay que desplazarla directamente al viewport.
    await imageLocator.scrollIntoViewIfNeeded();
    console.log('IMG initial ' + width + 'px: ' + JSON.stringify(await imageLocator.evaluate(img => ({
      src: img.currentSrc, loading: img.loading, complete: img.complete,
      naturalWidth: img.naturalWidth, bounds: img.getBoundingClientRect().toJSON()
    }))));
    try {
      await page.waitForFunction(() => {
        const image = document.querySelector('.rizzoma-offer__featured-visual img');
        return Boolean(image?.complete && image.naturalWidth > 0);
      }, null, { timeout: 15000 });
    } catch (error) {
      console.error('IMG failure ' + width + 'px: ' + JSON.stringify(await imageLocator.evaluate(img => ({
        src: img.currentSrc, complete: img.complete, naturalWidth: img.naturalWidth,
        outerHTML: img.outerHTML
      }))));
      throw error;
    }

    const dimensions = await page.evaluate(() => {
      const picture = document.querySelector('.rizzoma-offer__featured-visual');
      const image = picture.querySelector('img');
      const card = document.querySelector('.rizzoma-offer__featured');
      return {
        figureWidth: picture.getBoundingClientRect().width,
        imageWidth: image.getBoundingClientRect().width,
        imageHeight: image.getBoundingClientRect().height,
        cardWidth: card.getBoundingClientRect().width,
        computedPosition: getComputedStyle(image).position,
        naturalWidth: image.naturalWidth,
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth
      };
    });
    assert.ok(dimensions.imageWidth > 0.92 * dimensions.figureWidth,
      'La imagen quedó como miniatura en ' + width + 'px: ' + JSON.stringify(dimensions));
    assert.ok(dimensions.imageHeight >= 170,
      'Altura insuficiente de imagen en ' + width + 'px: ' + JSON.stringify(dimensions));
    assert.equal(dimensions.computedPosition, 'static',
      'La imagen no debe estar posicionada de forma absoluta en Safari móvil');
    assert.ok(dimensions.pageWidth <= dimensions.viewportWidth + 2,
      'Hay desbordamiento horizontal a ' + width + 'px: ' + JSON.stringify(dimensions));

    const arrow = await page.locator('.rz-home-feature__meta a span[aria-hidden]').first().textContent();
    assert.ok(arrow?.includes('\uFE0E'), 'La flecha debe solicitar presentación de texto en vez de emoji');
    await visual.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'mobile-artifacts/iphone-' + width + '.png' });
    console.log('PASS WebKit ' + width + 'px: ' + JSON.stringify(dimensions));
    await context.close();
  }
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
