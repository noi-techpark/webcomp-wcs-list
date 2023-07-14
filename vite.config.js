// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

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
    rollupOptions: {
      output: {
        entryFileNames: "wcs-list-widget.min.js"
      }
    }
  }
})
