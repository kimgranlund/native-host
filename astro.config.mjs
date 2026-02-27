// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Static output for a docs site — all pages pre-rendered at build time.
  output: 'static',
  vite: {
    css: {
      // Allow @import of npm packages in <style> blocks
      preprocessorOptions: {},
    },
  },
});
