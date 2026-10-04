import type { APIRoute } from 'astro';
import { availableProjects } from '@/data/projects';
import { site } from '@/config/site';

const staticRoutes = [
  '/',
  '/proyectos/',
  '/servicios/',
  '/arquitectura-medellin/',
  '/visualizacion-arquitectonica-medellin/',
  '/estudio/',
  '/contacto/'
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site: astroSite }) => {
  const baseUrl = astroSite?.toString() ?? site.domain;

  const staticEntries = staticRoutes.map((route) => {
    const loc = new URL(route.replace(/^\//, ''), baseUrl).toString();
    return `  <url><loc>${escapeXml(loc)}</loc></url>`;
  });

  const projectEntries = availableProjects.map((project) => {
    const loc = new URL(`proyectos/${project.slug}/`, baseUrl).toString();
    const images = [project.cover, ...(project.gallery ?? [])]
      .filter((image, index, all): image is string => Boolean(image) && all.indexOf(image) === index)
      .map((image) => `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(`${project.title} — Rizzoma Arquitectura`)}</image:title>
      <image:caption>${escapeXml(project.statement ?? project.intro ?? project.category)}</image:caption>
    </image:image>`)
      .join('');

    return `  <url>
    <loc>${escapeXml(loc)}</loc>${images}
  </url>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticEntries, ...projectEntries].join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
