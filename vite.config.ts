/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
    commonjsOptions: {
      transformMixedEsModules: true
    }
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
        sourceMap: true,
        includePaths: [
          './src/stylesheets',
          './node_modules/@uswds/uswds/packages'
        ]
      }
    },
    postcss: {
      plugins: [autoprefixer]
    }
  },
  resolve: {
    // TODO: Remove comments if okta-signin-widget upgrades make this truly not needed anymore
    // alias: {
    //   '@okta/okta-auth-js': '@okta/okta-auth-js/dist/okta-auth-js.umd.js'
    // }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globalSetup: './src/global-setup.js'
  }
});
