import { defineConfig } from 'astro/config';

// Se publica en https://juaniessi.github.io/recetario/
export default defineConfig({
  site: 'https://juaniessi.github.io',
  base: '/recetario',
  trailingSlash: 'always',
});
