import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
    open: true,
  // /*   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'cert/key.pem')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem')),
  //   } */
  },
  build: {
    outDir: 'dist',
  },
})
