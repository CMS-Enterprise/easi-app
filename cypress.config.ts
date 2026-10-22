import { defineConfig } from 'cypress';

import setupNodeEvents from './cypress/plugins';

export default defineConfig({
  viewportHeight: 800,
  viewportWidth: 1280,
  video: true,
  e2e: {
    setupNodeEvents,
    baseUrl: 'http://localhost:3000'
  },
  defaultCommandTimeout: 6000
});
