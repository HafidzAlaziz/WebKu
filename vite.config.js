import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    React(),
    Sitemap({
      hostname: 'https://www.web-kuu.my.id',
      dynamicRoutes: [
        '/',
        '/order',
        '/portfolio'
      ],
      robots: [{
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login']
      }]
    })
  ],
  preview: {
    port: 4173,
    strictPort: false,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
