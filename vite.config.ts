import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from "vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  define: {
    'process.env': process.env ?? {}
  }
})
