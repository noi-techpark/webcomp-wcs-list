import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({customElement: true})],
  server: {
    port: 3000
  },
  build: {
    assetsInlineLimit: 512000,
  }
})
