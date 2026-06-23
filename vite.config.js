import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // Add this for better production builds
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optional: reduce chunk size warning
    //chunkSizeWarningLimit: 1000,
  }
})