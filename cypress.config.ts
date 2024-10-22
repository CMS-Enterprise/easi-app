import { defineConfig } from 'cypress';

export default defineConfig({
  viewportHeight: 800,
  viewportWidth: 1280,
  video: true,
  e2e: {
    baseUrl: 'http://localhost:3000'
  },
  defaultCommandTimeout: 6000
});
