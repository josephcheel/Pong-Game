import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['es2022', 'chrome89', 'firefox89', 'edge89', 'safari15'],  // Targets modern browsers
  },
});
