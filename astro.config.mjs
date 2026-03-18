// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://enarmduo.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    tailwind(),
    sitemap({
      // Excluir rutas privadas/técnicas del sitemap
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/checkout/'),
    }),
  ],
});
