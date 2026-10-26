// Verificación sin dependencias extra. Ejecutar tras GITHUB_PAGES=true npm run build.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const slugs = [
  'cabo-san-miguel',
  'casa-patio-horizonte',
  'casa-el-umbral',
  'casa-el-santuario',
  'casa-oquedad'
];
const prefix = '/rizzoma-arquitectura/';
const pages = [
  'index.html',
  'portafolio/index.html',
  'servicios/index.html',
  'estudio/index.html',
  'contacto/index.html',
  ...slugs.map(slug => 'proyectos/' + slug + '/index.html')
];
const source = readFileSync('src/data/projects.ts', 'utf8');
for (const slug of slugs) {
  assert.ok(source.includes("slug: '" + slug + "'"), 'Proyecto eliminado del catálogo: ' + slug);
}
assert.equal((source.match(/slug: '/g) ?? []).length, 5, 'Verificar catálogo original de cinco proyectos');

const failures = [];
let imageCount = 0;
for (const page of pages) {
  const abs = path.join('dist', page);
  assert.ok(existsSync(abs), 'Página no generada: ' + page);
  const html = readFileSync(abs, 'utf8');
  assert.ok(/<title>/.test(html), 'Sin título: ' + page);
  for (const [, attr, value] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
    if (!value.startsWith(prefix)) continue;
    const raw = value.slice(prefix.length).split(/[?#]/)[0];
    if (!raw) continue;
    const target = path.join('dist', raw);
    if (!existsSync(target)) {
      if (existsSync(path.join(target, 'index.html'))) continue;
      failures.push(page + ': ' + attr + '=' + value);
      continue;
    }
    if (attr === 'src' && /\.(?:webp|png|jpe?g|svg)$/i.test(raw)) {
      assert.ok(statSync(target).size > 100, 'Imagen vacía: ' + value);
      imageCount++;
    }
  }
}
assert.deepEqual(failures, [], 'Enlaces a recursos locales no disponibles');
assert.ok(imageCount > 15, 'Se verificaron pocas imágenes (' + imageCount + ')');
const contactPage = readFileSync('dist/contacto/index.html', 'utf8');
assert.ok(contactPage.includes('rizzomaarquitectura@gmail.com'), 'El correo no figura en contacto');
assert.ok(contactPage.includes('573157414871'), 'El WhatsApp configurado no figura en contacto');
const servicePage = readFileSync('dist/servicios/index.html', 'utf8');
for (const id of ['arquitectura', 'modelado', 'visualizacion', 'remodelacion', 'diseno-visualizacion']) {
  assert.ok(servicePage.includes('id="' + id + '"'), 'Ancla de servicio ausente: ' + id);
}
for (const label of ['Desarrollo arquitectónico', 'Modelado y documentación arquitectónica', 'Visualización arquitectónica']) {
  assert.ok(servicePage.includes(label), 'Servicio ausente: ' + label);
}
console.log('Verificados ' + pages.length + ' documentos, ' + slugs.length + ' proyectos y ' + imageCount + ' referencias de imágenes.');
