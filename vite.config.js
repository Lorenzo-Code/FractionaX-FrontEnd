// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      open: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // HTTPS configuration for development
    https: false, // Set to true in production or when testing with HTTPS
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://fractionax.io', 'https://www.fractionax.io']
        : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'X-Session-ID']
    },
    // Security headers middleware
    middlewareMode: false,
  },
  build: {
    // Security optimizations
    minify: 'terser',
    ...(process.env.NODE_ENV === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }),
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming for security
        manualChunks: {
          vendor: ['react', 'react-dom'],
          security: ['./src/utils/security.js', './src/utils/secureApiClient.js'],
        },
      },
    },
    // Subresource Integrity
    assetsInlineLimit: 0, // Don't inline assets for CSP compliance
  },
  define: {
    // Ensure production builds don't expose sensitive info
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  preview: {
    // Security headers for preview mode
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
  },
});
