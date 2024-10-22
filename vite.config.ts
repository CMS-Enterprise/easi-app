/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build'
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 3000
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern',
        sourceMap: true,
        loadPaths: ['./src/stylesheets', './node_modules/@uswds/uswds/packages']
      }
    },
    postcss: {
      plugins: [autoprefixer]
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globalSetup: './src/global-setup.js'
  }
});
