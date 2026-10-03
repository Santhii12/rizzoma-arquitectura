import type { APIRoute } from 'astro';
import { availableProjects } from '@/data/projects';
import { site } from '@/config/site';

const staticRoutes = ['/', '/proyectos/', '/servicios/', '/estudio/', '/contacto/', '/privacidad/'];

export const GET: APIRoute = ({ site: astroSite }) => {
  const routes = [
    ...staticRoutes,
    ...availableProjects.map((project) => `/proyectos/${project.slug}/`)
  ];

  const baseUrl = astroSite?.toString() ?? site.domain;

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((route) => `  <url><loc>${new URL(route.replace(/^\//, ''), baseUrl).toString()}</loc></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
