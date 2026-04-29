import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
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
    rollupOptions: {
      // Externalize heavy Stellar SDK from initial bundle — loaded lazily
      external: [],
    },
  },
  optimizeDeps: {
    include: ['@stellar/stellar-sdk', '@stellar/freighter-api'],
  },
})
