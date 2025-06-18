import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Remove proxy when using nginx (nginx handles routing)
    // proxy: {
    //   '/api': {
    //     target: 'http://backend:5000',
    //     changeOrigin: true,
    //     secure: false,
    //     timeout: 10000
    //   }
    // },
    cors: true
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios']
        }
      }
    },
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  // Preview configuration (for production preview)
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  },

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // CSS configuration
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // Optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  },

  // Development settings
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})