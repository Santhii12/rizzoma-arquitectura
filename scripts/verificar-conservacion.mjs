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
const homePage = readFileSync('dist/index.html', 'utf8');
const firstContact = prefix + 'servicios/#arquitectura';
const secondContact = prefix + 'contacto/?tipo=colaboracion#colaboraciones';
const collabContact = prefix + 'contacto/?tipo=colaboracion#colaboraciones';
assert.ok(homePage.includes(firstContact), 'La tarjeta de proyecto propio no lleva a servicios de arquitectura');
assert.ok(homePage.includes(secondContact), 'La tarjeta de colaboración no lleva al contacto especializado');
assert.ok(homePage.includes('Tengo un proyecto de arquitectura'), 'Falta el primer camino de contacto');
assert.ok(homePage.includes('Busco apoyo para un proyecto'), 'Falta el segundo camino de contacto');
assert.ok(homePage.includes('Conoce nuestros servicios'), 'Falta la acción de servicios de arquitectura');
assert.ok(homePage.includes('Hablemos de una colaboración'), 'Falta la acción de colaboración');
assert.ok(homePage.includes('Diseño arquitectónico y visualización para dar forma a nuevas ideas y espacios'), 'Falta el texto exacto del proyecto propio');
assert.ok(homePage.includes('Colaboración con arquitectos y estudios en diseño, modelado, documentación y visualización arquitectónica'), 'Falta el texto exacto del apoyo externo');
assert.ok(homePage.includes(prefix + 'images/projects/casa-patio-horizonte/exteriores/exterior-01.webp'), 'La primera tarjeta no usa la imagen original de Patio Horizonte');
assert.ok(homePage.includes(prefix + 'images/projects/cabo-san-miguel/modelo-01.webp'), 'La segunda tarjeta no usa el modelo original de Cabo San Miguel');
const pathCards = homePage.match(/class="rizzoma-offer__path"/g) ?? [];
assert.equal(pathCards.length, 2, 'Deben existir exactamente dos tarjetas de acceso');

assert.ok(contactPage.includes('id="contacto-formulario"'), 'Falta el ancla del primer camino');
assert.ok(contactPage.includes('id="colaboraciones"'), 'Falta el ancla del contacto de colaboración');
assert.ok(contactPage.includes('Colaboración con arquitecto o estudio'), 'Falta el tipo de encargo colaborativo');
assert.ok(contactPage.includes('Proyecto propio'), 'Falta el tipo de encargo propio');
assert.ok(servicePage.includes('id="colaboraciones"'), 'Falta la sección de colaboración externa');
assert.ok(servicePage.includes(collabContact), 'La colaboración no conduce al contacto específico');
for (const phrase of ['diseño y desarrollo arquitectónico', 'modelado tridimensional', 'documentación gráfica', 'visualización']) {
  assert.ok(servicePage.includes(phrase), 'Falta una capacidad colaborativa: ' + phrase);
}
const clientScript = readFileSync('src/scripts/site.ts', 'utf8');
assert.ok(clientScript.includes("entryType === 'colaboracion'"), 'La selección de colaboración no está programada');
assert.ok(clientScript.includes("entryType === 'proyecto-propio'"), 'La selección de proyecto propio no está programada');
console.log('Verificados los dos caminos de contacto, anclas y preselección de tipo de encargo.');

console.log('Verificados ' + pages.length + ' documentos, ' + slugs.length + ' proyectos y ' + imageCount + ' referencias de imágenes.');
