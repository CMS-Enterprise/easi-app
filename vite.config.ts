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
    // Node modules that use `require` statements need to be transpiled to use `import`
    // One of the problematic modules is (at time of writing) @okta/okta-signin-widget
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/config.ts',
    globalSetup: './src/config/global-setup.js'
  }
});
