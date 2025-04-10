import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';

// Use dynamic import for vite-tsconfig-paths
const viteTsconfigPaths = await import('vite-tsconfig-paths').then(mod => mod.default);

export default defineConfig({
  build: {
    outDir: 'build',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 3000,
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: ['./src/stylesheets', './node_modules/@uswds/uswds/packages'],
      },
    },
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
