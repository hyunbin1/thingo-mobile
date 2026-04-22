import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://mjsearch.org',
      dynamicRoutes: [
        '/board',
        '/board/write',
        '/notice',
        '/news',
        '/login',
        '/broadcast',
        '/register',
        '/find-password',
        '/menu',
        '/academic-calendar',
        '/department',
        '/search',
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png'],
      manifest: {
        name: 'Thingo',
        short_name: 'Thingo',
        description: '명지대학교 학생들을 위한 통합 검색 플랫폼',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/img/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/img/icon-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/img/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['**/static/**'],
        navigateFallbackDenylist: [/^\/static\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@public', replacement: path.resolve(__dirname, 'public') },
    ],
  },
});
