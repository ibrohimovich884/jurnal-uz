import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- bu qator kerak

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1024,
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Jurnal uz",
        short_name: "Jurnal uz",
        description: "Maktab jurnali ilovasi",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#ffffff",
        // vite.config.js ichida
        icons: [
          {
            src: '/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any' // Standart ko'rinish uchun
          },
          {
            src: '/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable' // Orqa fonni to'ldirishga ruxsat berish uchun
          },
          {
            src: '/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      strategies: 'generateSW',
      registerType: 'autoUpdate',
    }),
  ],
});
