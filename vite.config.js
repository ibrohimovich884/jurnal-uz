import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- bu qator kerak
import { execSync } from 'node:child_process';

// Jadval ma'lumotlari (schedules.jsx) oxirgi marta qachon o'zgarganini avtomatik aniqlaydi.
// Git tarixi mavjud bo'lsa - o'sha faylning oxirgi commit sanasini oladi.
// Aks holda (masalan, .git papkasi yo'q joyda) - hozirgi build vaqtini ishlatadi.
function getScheduleUpdatedAt() {
  try {
    const gitDate = execSync('git log -1 --format=%cI -- src/data/schedules.jsx')
      .toString()
      .trim();
    if (gitDate) return gitDate;
  } catch {
    // git mavjud emas yoki repo emas — pastdagi fallback ishlatiladi
  }
  return new Date().toISOString();
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  define: {
    __SCHEDULE_UPDATED_AT__: JSON.stringify(getScheduleUpdatedAt()),
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
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any' // Standart ko'rinish uchun
          },
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable' // Orqa fonni to'ldirishga ruxsat berish uchun
          },
          {
            src: '/icon.svg',
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
