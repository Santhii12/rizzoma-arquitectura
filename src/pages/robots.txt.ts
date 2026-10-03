import type { APIRoute } from 'astro';
import { site } from '@/config/site';

export const GET: APIRoute = ({ site: astroSite }) => {
  const baseUrl = astroSite?.toString() ?? site.domain;
  const sitemap = new URL('sitemap.xml', baseUrl).toString();
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
