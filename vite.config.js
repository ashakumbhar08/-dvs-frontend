import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Required by Stellar SDK in browser environment
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Externalize heavy Stellar SDK from initial bundle — loaded lazily
      external: [],
    },
  },
  optimizeDeps: {
    include: ['@stellar/stellar-sdk', '@stellar/freighter-api'],
  },
})
