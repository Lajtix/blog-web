import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    host: true, // Nutné pro běh v Dockeru
    port: 5173,
    watch: { usePolling: true }
})
