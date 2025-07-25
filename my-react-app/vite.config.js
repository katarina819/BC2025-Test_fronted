import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    open: true,
  },
  // For SPA fallback (return index.html for unknown routes)
  build: {
    outDir: 'dist',
  },
});
