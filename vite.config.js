// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Optimize React in production
      jsxRuntime: 'automatic'
    }),
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
    // Enhanced performance optimizations while keeping working chunking
    minify: 'terser',
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false, // Inline CSS for faster initial load
    sourcemap: false, // Disable sourcemaps in production for smaller files
    ...(process.env.NODE_ENV === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 3, // More compression passes
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          unsafe_comps: true,
          unsafe_math: true,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false, // Remove comments
        },
      },
    }),
    rollupOptions: {
      output: {
        // Advanced chunking strategy for better performance
        manualChunks: {
          // Ensure React is loaded first as a separate chunk
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          // Web3 libraries depend on React, so they'll be loaded after
          'web3-vendor': [
            '@rainbow-me/rainbowkit',
            'wagmi',
            'viem',
            '@tanstack/react-query'
          ],
          // Chart libraries
          'charts-vendor': ['chart.js', 'recharts', 'react-chartjs-2'],
          // UI libraries
          'ui-vendor': [
            'framer-motion',
            'lucide-react', 
            'react-icons',
            '@tiptap/react',
            '@tiptap/starter-kit',
            'aos'
          ]
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Subresource Integrity
    assetsInlineLimit: 4096, // Inline small assets for fewer requests
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
