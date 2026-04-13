// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({customElement: true})],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
  server: {
    port: 3001,
    cors: true
  },
  build: {
    assetsInlineLimit: 512000,
    rolldownOptions: {
      output: {
        entryFileNames: "wcs-list-widget.min.js"
      }
    }
  }
})
