// Auditoría reproducible de la salida estática de Rizzoma.
// Ejecutar con GITHUB_PAGES=true npm run build; después node scripts/auditar-tecnico.mjs.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = 'dist';
const routes = [
  'index.html', 'portafolio/index.html', 'servicios/index.html',
  'arquitectura-medellin/index.html',
  'visualizacion-arquitectonica-medellin/index.html',
  'estudio/index.html', 'contacto/index.html',
  ...['cabo-san-miguel', 'casa-patio-horizonte', 'casa-el-umbral',
      'casa-el-santuario', 'casa-oquedad'].map(slug => `proyectos/${slug}/index.html`)
];
const read = rel => {
  const file = path.join(root, rel);
  assert.ok(existsSync(file), `No existe archivo compilado: ${rel}`);
  return readFileSync(file, 'utf8');
};
const escaped = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const warnings = [];
const base = '/rizzoma-arquitectura/';

const notFound = read('404.html');
assert.match(notFound, /noindex/, '404 debe ser noindex');
assert.ok(notFound.includes(base + 'portafolio/'), '404 no enlaza portafolio');
assert.ok(notFound.includes(base), '404 no enlaza inicio');

const privacy = read('privacidad/index.html');
assert.match(privacy, /noindex/, 'Aviso provisional debe permanecer fuera del índice');
assert.ok(privacy.includes('rizzomaarquitectura@gmail.com'), 'No hay canal para derechos en aviso');
assert.ok(privacy.includes('WhatsApp'), 'Falta información sobre el envío del formulario');

const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
assert.ok(/User-agent:\s*\*/i.test(robots), 'robots sin grupo de bots');
assert.ok(/Allow:\s*\//i.test(robots), 'robots debe permitir rutas del sitio');
assert.ok(!/Disallow:\s*\//i.test(robots), 'robots bloquea el sitio');
assert.ok(robots.includes('sitemap.xml'), 'robots sin sitemap');
assert.ok(sitemap.includes('<urlset'), 'XML del sitemap ausente');

let images = 0, lazy = 0, missingAlt = 0, headings = 0;
const badLinks = [];
for (const file of routes) {
  const html = read(file);
  assert.match(html, /<title>[^<]+<\/title>/, `Sin título: ${file}`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `Sin descripción: ${file}`);
  assert.match(html, /<link rel="canonical" href="https:\/\//, `Sin canonical absoluto: ${file}`);
  assert.match(html, /<meta property="og:image" content="https:\/\//, `Sin imagen social absoluta: ${file}`);
  assert.ok(!/name="robots" content="noindex/i.test(html), `Se está bloqueando una página pública: ${file}`);
  assert.ok(html.includes(base + 'privacidad/'), `Falta privacidad en footer: ${file}`);

  const headingsOnPage = [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;
  headings += headingsOnPage;
  if (headingsOnPage !== 1) warnings.push(`Jerarquía H1 ${file}: ${headingsOnPage}`);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    images++;
    if (!/\balt\s*=/.test(match[0])) missingAlt++;
    if (/\bloading="lazy"/.test(match[0])) lazy++;
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
    const url = match[1];
    if (!url.startsWith(base)) continue;
    const local = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);
    if (!local) continue;
    if (local.includes('..')) { badLinks.push(`${file}: ${url}`); continue; }
    const p = path.join(root, local);
    if (!existsSync(p) && !existsSync(path.join(p, 'index.html'))) badLinks.push(`${file}: ${url}`);
  }
}
assert.deepEqual(badLinks, [], 'Referencias internas rotas en páginas esenciales');
assert.equal(missingAlt, 0, 'Hay imágenes sin atributo alt');
assert.ok(images >= 30, 'Se detectaron menos imágenes de lo esperado');

const expectedUrls = routes.map(route =>
  'https://santhii12.github.io/rizzoma-arquitectura/' + route.replace(/index\.html$/, '')
);
for (const url of expectedUrls) {
  assert.ok(sitemap.includes('<loc>' + url + '</loc>'), `URL indexable ausente en sitemap: ${url}`);
}
assert.ok(!sitemap.includes('/privacidad/'), 'Aviso provisional indexado en sitemap');
assert.ok(!sitemap.includes('/404'), '404 indexado en sitemap');
console.log(`SEO técnico: ${routes.length} páginas indexables, 404 y privacidad correctas.`);
console.log(`Imágenes: ${images} etiquetas, ${lazy} carga diferida, ${missingAlt} sin alt.`);
console.log(`Referencias internas rotas: ${badLinks.length}. Avisos no bloqueantes: ${warnings.length}.`);
warnings.slice(0, 12).forEach(w => console.log('REVISAR: ' + w));
