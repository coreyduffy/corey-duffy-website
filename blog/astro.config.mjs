import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://coreyduffy.com',
  output: 'static',
  outDir: '../build',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
