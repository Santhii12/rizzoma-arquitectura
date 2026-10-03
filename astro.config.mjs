import { defineConfig } from 'astro/config';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages
    ? 'https://santhii12.github.io/rizzoma-arquitectura/'
    : 'https://rizzomaarquitectura.com',
  base: isGitHubPages ? '/rizzoma-arquitectura' : undefined,
  output: 'static',
  prefetch: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
