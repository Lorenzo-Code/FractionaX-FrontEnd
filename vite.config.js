import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path'; // Needed to resolve paths

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      open: true, // auto-opens report after build
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Enables @/ pointing to /src
    },
  },
});
