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
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    ...(process.env.NODE_ENV === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2,
        },
        mangle: {
          safari10: true,
        },
      },
    }),
    rollupOptions: {
      output: {
        // Advanced chunking strategy for better performance
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Wallet and blockchain libraries
          if (id.includes('@rainbow-me') || id.includes('wagmi') || id.includes('viem') || 
              id.includes('@walletconnect') || id.includes('@coinbase') || id.includes('@tanstack/react-query')) {
            return 'web3-vendor';
          }
          // Chart and visualization libraries
          if (id.includes('chart.js') || id.includes('recharts') || id.includes('react-chartjs')) {
            return 'charts-vendor';
          }
          // UI and animation libraries
          if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-icons') || 
              id.includes('@tiptap') || id.includes('aos')) {
            return 'ui-vendor';
          }
          // Utility libraries
          if (id.includes('axios') || id.includes('dayjs') || id.includes('dompurify') || 
              id.includes('react-toastify') || id.includes('socket.io-client')) {
            return 'utils-vendor';
          }
          // Particles and maps
          if (id.includes('tsparticles') || id.includes('react-tsparticles') || id.includes('@react-google-maps')) {
            return 'interactive-vendor';
          }
          // Security utils
          if (id.includes('./src/utils/security.js') || id.includes('./src/utils/secureApiClient.js')) {
            return 'security';
          }
          // Admin components (lazy load)
          if (id.includes('/src/pages/admin/') || id.includes('/src/components/admin/')) {
            return 'admin-chunk';
          }
          // Node modules general
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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
