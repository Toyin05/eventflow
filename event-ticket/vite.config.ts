import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), nodePolyfills()],
  base: '/',
  define: {
    'process.env': {},
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['node:async_hooks'],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ['@tanstack/start-storage-context']
  },
})
